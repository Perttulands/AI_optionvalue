/**
 * Option Value Calculator
 *
 * Calculates the expected value of parallel exploration using
 * simplified real options theory.
 */

(function() {
    'use strict';

    // DOM Elements
    const inputs = {
        uncertainty: document.getElementById('uncertainty'),
        approaches: document.getElementById('approaches'),
        explorationCost: document.getElementById('exploration-cost'),
        projectValue: document.getElementById('project-value')
    };

    const displays = {
        uncertaintyValue: document.getElementById('uncertainty-value'),
        approachesValue: document.getElementById('approaches-value'),
        explorationCostValue: document.getElementById('exploration-cost-value'),
        projectValueValue: document.getElementById('project-value-value'),
        optionValue: document.getElementById('option-value'),
        singleEv: document.getElementById('single-ev'),
        parallelEv: document.getElementById('parallel-ev'),
        successProb: document.getElementById('success-prob'),
        roi: document.getElementById('roi')
    };

    let chart = null;

    /**
     * Format number as currency
     */
    function formatCurrency(value) {
        const absValue = Math.abs(value);
        if (absValue >= 1000000000) {
            return '$' + (value / 1000000000).toFixed(2) + 'B';
        }
        if (absValue >= 1000000) {
            return '$' + (value / 1000000).toFixed(1) + 'M';
        }
        if (absValue >= 1000) {
            return '$' + Math.round(value).toLocaleString();
        }
        return '$' + Math.round(value).toLocaleString();
    }

    /**
     * Format number with commas
     */
    function formatNumber(value) {
        return Math.round(value).toLocaleString();
    }

    /**
     * Format percentage
     */
    function formatPercent(value) {
        return (value * 100).toFixed(1) + '%';
    }

    /**
     * Exponential scaling for sliders (log-like response)
     */
    function scaleExp(value, min, max) {
        const clamped = Math.min(Math.max(value, 0), 100);
        const ratio = max / min;
        return min * Math.pow(ratio, clamped / 100);
    }

    const sliderRanges = {
        explorationCost: {
            min: 100,
            max: 5000000
        },
        projectValue: {
            min: 10000,
            max: 1000000000
        }
    };

    /**
     * Calculate probability that at least one approach succeeds
     * P(at least one success) = 1 - P(all fail) = 1 - (failure_rate)^n
     */
    function calcSuccessProbability(failureRate, numApproaches) {
        return 1 - Math.pow(failureRate, numApproaches);
    }

    /**
     * Calculate expected value for single approach
     * EV = P(success) * Value - Cost
     */
    function calcSingleExpectedValue(failureRate, projectValue, explorationCost) {
        const successRate = 1 - failureRate;
        return (successRate * projectValue) - explorationCost;
    }

    /**
     * Calculate expected value for parallel exploration
     * EV = P(at least one success) * Value - (N * Cost)
     */
    function calcParallelExpectedValue(failureRate, numApproaches, projectValue, explorationCost) {
        const successProb = calcSuccessProbability(failureRate, numApproaches);
        const totalCost = numApproaches * explorationCost;
        return (successProb * projectValue) - totalCost;
    }

    /**
     * Calculate the option value (benefit of parallel exploration)
     */
    function calcOptionValue(failureRate, numApproaches, projectValue, explorationCost) {
        const singleEv = calcSingleExpectedValue(failureRate, projectValue, explorationCost);
        const parallelEv = calcParallelExpectedValue(failureRate, numApproaches, projectValue, explorationCost);
        return parallelEv - singleEv;
    }

    /**
     * Calculate ROI on exploration
     */
    function calcROI(optionValue, additionalCost) {
        if (additionalCost <= 0) return 0;
        return optionValue / additionalCost;
    }

    /**
     * Get current input values
     */
    function getInputValues() {
        return {
            failureRate: parseInt(inputs.uncertainty.value) / 100,
            numApproaches: parseInt(inputs.approaches.value),
            explorationCost: scaleExp(parseInt(inputs.explorationCost.value), sliderRanges.explorationCost.min, sliderRanges.explorationCost.max),
            projectValue: scaleExp(parseInt(inputs.projectValue.value), sliderRanges.projectValue.min, sliderRanges.projectValue.max)
        };
    }

    /**
     * Update display values
     */
    function updateDisplays() {
        const { failureRate, numApproaches, explorationCost, projectValue } = getInputValues();

        // Update input value displays
        displays.uncertaintyValue.textContent = Math.round(failureRate * 100);
        displays.approachesValue.textContent = numApproaches;
        displays.explorationCostValue.textContent = formatNumber(explorationCost);
        displays.projectValueValue.textContent = formatNumber(projectValue);

        // Calculate values
        const singleEv = calcSingleExpectedValue(failureRate, projectValue, explorationCost);
        const parallelEv = calcParallelExpectedValue(failureRate, numApproaches, projectValue, explorationCost);
        const optionValue = calcOptionValue(failureRate, numApproaches, projectValue, explorationCost);
        const successProb = calcSuccessProbability(failureRate, numApproaches);
        const additionalCost = (numApproaches - 1) * explorationCost;
        const roi = calcROI(optionValue, additionalCost);

        // Update output displays
        displays.singleEv.textContent = formatCurrency(singleEv);
        displays.parallelEv.textContent = formatCurrency(parallelEv);
        displays.optionValue.textContent = formatCurrency(optionValue);
        displays.successProb.textContent = formatPercent(successProb);
        displays.roi.textContent = roi > 0 ? Math.round(roi * 100) + '%' : 'N/A';

        // Color code option value
        if (optionValue > 0) {
            displays.optionValue.style.color = '';
        } else {
            displays.optionValue.style.color = '#990F3D';
        }

        // Update chart
        updateChart(failureRate, numApproaches, projectValue, explorationCost);
    }

    /**
     * Initialize or update the chart
     */
    function updateChart(failureRate, numApproaches, projectValue, explorationCost) {
        const ctx = document.getElementById('comparison-chart').getContext('2d');

        // Generate data for 1-10 approaches
        const labels = [];
        const expectedValues = [];
        const successProbs = [];

        for (let n = 1; n <= 10; n++) {
            labels.push(n + (n === 1 ? ' approach' : ' approaches'));
            expectedValues.push(calcParallelExpectedValue(failureRate, n, projectValue, explorationCost));
            successProbs.push(calcSuccessProbability(failureRate, n) * 100);
        }

        // Find optimal number of approaches
        const maxEv = Math.max(...expectedValues);
        const optimalN = expectedValues.indexOf(maxEv);

        // Highlight current selection
        const backgroundColors = expectedValues.map((_, i) => {
            if (i === numApproaches - 1) {
                return 'rgba(13, 118, 128, 0.9)';
            }
            if (i === optimalN) {
                return 'rgba(13, 118, 128, 0.6)';
            }
            return 'rgba(26, 26, 26, 0.7)';
        });

        if (chart) {
            chart.data.labels = labels;
            chart.data.datasets[0].data = expectedValues;
            chart.data.datasets[0].backgroundColor = backgroundColors;
            chart.update('none');
        } else {
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Expected Value',
                        data: expectedValues,
                        backgroundColor: backgroundColors,
                        borderRadius: 2,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: '#1A1A1A',
                            titleFont: {
                                family: "'Inter', sans-serif",
                                size: 12
                            },
                            bodyFont: {
                                family: "'Inter', sans-serif",
                                size: 14
                            },
                            padding: 12,
                            cornerRadius: 2,
                            callbacks: {
                                label: function(context) {
                                    const value = context.raw;
                                    const prob = successProbs[context.dataIndex];
                                    return [
                                        'Expected Value: ' + formatCurrency(value),
                                        'Success Probability: ' + prob.toFixed(1) + '%'
                                    ];
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: {
                                    family: "'Inter', sans-serif",
                                    size: 11
                                },
                                color: '#707070'
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            ticks: {
                                font: {
                                    family: "'Inter', sans-serif",
                                    size: 11
                                },
                                color: '#707070',
                                callback: function(value) {
                                    return formatCurrency(value);
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    /**
     * Initialize event listeners
     */
    function initEventListeners() {
        Object.values(inputs).forEach(input => {
            input.addEventListener('input', updateDisplays);
        });
    }

    /**
     * Initialize calculator
     */
    function init() {
        initEventListeners();
        updateDisplays();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
