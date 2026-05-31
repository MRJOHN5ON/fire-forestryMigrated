document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements - Tabs
    const standardTab = document.getElementById('standardTab');
    const advancedTab = document.getElementById('advancedTab');
    
    const standardMethods = document.getElementById('standardMethods');
    const advancedMethods = document.getElementById('advancedMethods');
    
    // Method buttons
    const shadowMethod = document.getElementById('shadowMethod');
    const angleMethod = document.getElementById('angleMethod');
    const hypotenuseMethod = document.getElementById('hypotenuseMethod');
    const clinometerMethod = document.getElementById('clinometerMethod');
    const triangulationMethod = document.getElementById('triangulationMethod');
    
    // Input groups
    const shadowInput = document.getElementById('shadowInput');
    const angleInput = document.getElementById('angleInput');
    const hypotenuseInput = document.getElementById('hypotenuseInput');
    const clinometerInput = document.getElementById('clinometerInput');
    const triangulationInput = document.getElementById('triangulationInput');
    
    // Method description
    const methodDescription = document.getElementById('methodDescription');
    
    // Other UI elements
    const calculateBtn = document.getElementById('calculate');
    const resultArea = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    
    // Replace old unit toggle with new unit selectors
    const unitSystem = document.getElementById('unitSystem');
    const unitType = document.getElementById('unitType');
    const unitTexts = document.getElementsByClassName('unit-text');
    const saveResults = document.getElementById('saveResults');
    
    // Initialize variables
    let isMetric = true;
    let currentUnit = 'meters';
    let currentMethod = 'angle'; // Default method
    
    // Conversion factors for different units
    const conversions = {
        // Base unit is meters
        meters: 1,
        centimeters: 100,
        kilometers: 0.001,
        feet: 3.28084,
        inches: 39.3701,
        yards: 1.09361,
        miles: 0.000621371
    };
    
    // Method info tabs
    const methodInfoTabs = document.querySelectorAll('.method-info-tab');
    const methodInfoSections = document.querySelectorAll('.method-info');
    
    // Initialize method descriptions
    const methodDescriptions = {
        shadow: `<h4>Shadow Method</h4>
                <p>Works best on sunny days with clear shadows:</p>
                <ol>
                    <li>Measure your own height</li>
                    <li>Measure the length of your shadow</li>
                    <li>Measure the length of the tree's shadow</li>
                    <li>Tree height = (Your height × Tree's shadow) ÷ Your shadow</li>
                </ol>`,
        
        angle: `<h4>Angle Method</h4>
                <p>Uses basic trigonometry:</p>
                <ol>
                    <li>Measure the horizontal distance to the tree</li>
                    <li>Use a smartphone app to measure the angle to the tree top</li>
                    <li>For even better accuracy, include your eye height</li>
                </ol>`,
        
        hypotenuse: `<h4>Line-of-Sight Method</h4>
                    <p>Uses the Pythagorean theorem:</p>
                    <ol>
                        <li>Measure the horizontal distance to the tree</li>
                        <li>Measure the diagonal distance to the tree top</li>
                        <li>The calculator will find the height</li>
                    </ol>`,
        
        clinometer: `<h4>Clinometer Method</h4>
                    <p>Uses a specialized angle measuring device:</p>
                    <ol>
                        <li>Measure the distance to the tree</li>
                        <li>Use a clinometer to sight the top of the tree</li>
                        <li>Record the angle reading</li>
                        <li>Measure your eye height from the ground</li>
                    </ol>`,
        
        triangulation: `<h4>Triangulation Method</h4>
                        <p>A professional method using two measurement positions:</p>
                        <ol>
                            <li>Measure angle and distance from first position</li>
                            <li>Move to a second position</li>
                            <li>Measure angle and distance again</li>
                            <li>The calculator combines these measurements for high accuracy</li>
                        </ol>`
    };

    // Unit system change handler
    unitSystem.addEventListener('change', function() {
        isMetric = unitSystem.value === 'metric';
        
        // Update available unit types
        updateUnitTypeOptions();
        
        // Update unit text labels and convert existing values
        updateUnitLabels();
        convertAllValues();
    });
    
    // Unit type change handler
    unitType.addEventListener('change', function() {
        currentUnit = unitType.value;
        
        // Update unit text labels and convert existing values
        updateUnitLabels();
        convertAllValues();
    });
    
    // Function to update unit type dropdown options based on selected system
    function updateUnitTypeOptions() {
        // Clear the current unit selection
        unitType.querySelectorAll('option').forEach(option => {
            if (isMetric) {
                // Enable metric options, disable imperial options
                if (option.parentElement.label === 'Metric') {
                    option.disabled = false;
                } else {
                    option.disabled = true;
                }
            } else {
                // Enable imperial options, disable metric options
                if (option.parentElement.label === 'Imperial') {
                    option.disabled = false;
                } else {
                    option.disabled = true;
                }
            }
        });
        
        // Select the appropriate default option
        if (isMetric) {
            unitType.value = 'meters';
            currentUnit = 'meters';
        } else {
            unitType.value = 'feet';
            currentUnit = 'feet';
        }
    }
    
    // Function to update all unit text labels
    function updateUnitLabels() {
        Array.from(unitTexts).forEach(span => {
            span.textContent = currentUnit;
        });
    }
    
    // Function to convert all input values to the selected unit
    function convertAllValues() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            if (input.value) {
                // Store original value in the base unit (meters)
                if (!input.dataset.baseValue) {
                    // First conversion - store original
                    input.dataset.baseValue = isMetric ? input.value : (input.value / conversions.feet);
                }
                
                // Convert from base value (meters) to current unit
                const baseValue = parseFloat(input.dataset.baseValue);
                input.value = (baseValue * conversions[currentUnit]).toFixed(2);
            }
        });
        
        // Update result if it exists
        if (resultArea.textContent !== 'Tree height will appear here') {
            calculateHeight();
        }
    }

    // Convert value from one unit to another
    function convertValue(value, fromUnit, toUnit) {
        // Convert to base unit (meters) first
        const baseValue = value / conversions[fromUnit];
        // Then convert to target unit
        return (baseValue * conversions[toUnit]).toFixed(2);
    }
    
    // Convert input value to meters for calculation
    function getValueInMeters(value) {
        return value / conversions[currentUnit];
    }
    
    // Format result in the current unit
    function formatResult(valueInMeters) {
        return (valueInMeters * conversions[currentUnit]).toFixed(2);
    }
    
    // Tab selection handlers
    standardTab.addEventListener('click', function() {
        setActiveTab('standard');
    });
    
    advancedTab.addEventListener('click', function() {
        setActiveTab('advanced');
    });
    
    // Tab switching function
    function setActiveTab(tab) {
        // Reset all tabs and hide all method selectors
        standardTab.classList.remove('active');
        advancedTab.classList.remove('active');
        
        standardMethods.classList.add('hidden');
        advancedMethods.classList.add('hidden');
        
        // Activate the selected tab and show its methods
        if (tab === 'standard') {
            standardTab.classList.add('active');
            standardMethods.classList.remove('hidden');
            if (!currentMethod.match(/^(angle|hypotenuse|shadow)$/)) {
                setActiveMethod('angle', angleMethod, angleInput);
            }
        } else if (tab === 'advanced') {
            advancedTab.classList.add('active');
            advancedMethods.classList.remove('hidden');
            if (!currentMethod.match(/^(clinometer|triangulation)$/)) {
                setActiveMethod('clinometer', clinometerMethod, clinometerInput);
            }
        }
    }
    
    // Hide all input sections
    function hideAllInputs() {
        shadowInput.classList.add('hidden');
        angleInput.classList.add('hidden');
        hypotenuseInput.classList.add('hidden');
        clinometerInput.classList.add('hidden');
        triangulationInput.classList.add('hidden');
    }

    // Method selection handlers
    shadowMethod.addEventListener('click', function() {
        setActiveMethod('shadow', shadowMethod, shadowInput);
    });
    
    angleMethod.addEventListener('click', function() {
        setActiveMethod('angle', angleMethod, angleInput);
    });
    
    hypotenuseMethod.addEventListener('click', function() {
        setActiveMethod('hypotenuse', hypotenuseMethod, hypotenuseInput);
    });
    
    clinometerMethod.addEventListener('click', function() {
        setActiveMethod('clinometer', clinometerMethod, clinometerInput);
    });
    
    triangulationMethod.addEventListener('click', function() {
        setActiveMethod('triangulation', triangulationMethod, triangulationInput);
    });
    
    function setActiveMethod(method, button, inputSection) {
        // Reset all method buttons in the current tab
        const parentSelector = button.parentElement;
        const tabButtons = parentSelector.querySelectorAll('.method-btn');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Set active method
        button.classList.add('active');
        currentMethod = method;
        
        // Hide all input sections and show the selected one
        hideAllInputs();
        inputSection.classList.remove('hidden');
        
        // Update method description
        methodDescription.innerHTML = methodDescriptions[method];
        
        clearError();
    }
    
    // Info tab handlers
    methodInfoTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            
            // Reset all tabs and sections
            methodInfoTabs.forEach(t => t.classList.remove('active'));
            methodInfoSections.forEach(s => s.classList.add('hidden'));
            
            // Activate the selected tab and section
            this.classList.add('active');
            document.getElementById(method + 'Info').classList.remove('hidden');
        });
    });

    // Calculate button click handler
    calculateBtn.addEventListener('click', calculateHeight);

    function calculateHeight() {
        clearError();
        let heightInMeters = 0;
        
        try {
            switch(currentMethod) {
                case 'shadow':
                    heightInMeters = calculateShadowMethod();
                    break;
                case 'angle':
                    heightInMeters = calculateAngleMethod();
                    break;
                case 'hypotenuse':
                    heightInMeters = calculateHypotenuseMethod();
                    break;
                case 'clinometer':
                    heightInMeters = calculateClinometerMethod();
                    break;
                case 'triangulation':
                    heightInMeters = calculateTriangulationMethod();
                    break;
                default:
                    showError('Invalid method selected');
                    return;
            }
            
            if (heightInMeters <= 0) {
                showError('Calculation error: Invalid result');
                return;
            }
            
            resultArea.innerHTML = `<p>The tree is <strong>${formatResult(heightInMeters)} ${currentUnit}</strong> tall</p>`;
            saveResults.classList.remove('hidden');
        } catch (error) {
            showError('Error calculating height: ' + error.message);
        }
    }
    
    // Calculation methods
    function calculateShadowMethod() {
        const yourHeight = getValueInMeters(parseFloat(document.getElementById('yourHeight').value));
        const yourShadow = getValueInMeters(parseFloat(document.getElementById('yourShadow').value));
        const treeShadow = getValueInMeters(parseFloat(document.getElementById('treeShadow').value));
        
        validatePositiveInputs('yourHeight', 'yourShadow', 'treeShadow');
        
        // Formula: tree height = (your height × tree's shadow) ÷ your shadow
        return (yourHeight * treeShadow) / yourShadow;
    }
    
    function calculateAngleMethod() {
        const baseDistance = getValueInMeters(parseFloat(document.getElementById('baseDistance').value));
        const angle = parseFloat(document.getElementById('angle').value);
        const eyeHeightInput = document.getElementById('eyeHeight');
        
        validatePositiveInputs('baseDistance');
        
        if (!angle || angle <= 0 || angle >= 90) {
            throw new Error('Please enter a valid angle (between 0 and 90 degrees)');
        }
        
        // Convert angle to radians
        const angleRad = angle * Math.PI / 180;
        
        // Calculate height from angle and distance
        let height = baseDistance * Math.tan(angleRad);
        
        // Add eye height if provided
        if (eyeHeightInput.value) {
            const eyeHeight = getValueInMeters(parseFloat(eyeHeightInput.value));
            if (eyeHeight > 0) {
                height += eyeHeight;
            }
        }
        
        return height;
    }
    
    function calculateHypotenuseMethod() {
        const baseDistance = getValueInMeters(parseFloat(document.getElementById('baseDistance2').value));
        const hypotenuse = getValueInMeters(parseFloat(document.getElementById('hypotenuse').value));
        
        validatePositiveInputs('baseDistance2', 'hypotenuse');
        
        if (hypotenuse <= baseDistance) {
            throw new Error('Line-of-sight distance must be greater than base distance');
        }
        
        // Formula: tree height = √(hypotenuse² - base distance²)
        return Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(baseDistance, 2));
    }
    
    function calculateClinometerMethod() {
        const clinoDistance = getValueInMeters(parseFloat(document.getElementById('clinoDistance').value));
        const clinoAngle = parseFloat(document.getElementById('clinoAngle').value);
        const clinoEyeHeight = getValueInMeters(parseFloat(document.getElementById('clinoEyeHeight').value));
        
        validatePositiveInputs('clinoDistance', 'clinoEyeHeight');
        
        if (!clinoAngle || clinoAngle <= 0 || clinoAngle >= 90) {
            throw new Error('Please enter a valid clinometer angle (between 0 and 90 degrees)');
        }
        
        // Convert angle to radians
        const angleRad = clinoAngle * Math.PI / 180;
        
        // Calculate height using clinometer formula
        return (clinoDistance * Math.tan(angleRad)) + clinoEyeHeight;
    }
    
    function calculateTriangulationMethod() {
        const distance1 = getValueInMeters(parseFloat(document.getElementById('distance1').value));
        const angle1 = parseFloat(document.getElementById('angle1').value);
        const distance2 = getValueInMeters(parseFloat(document.getElementById('distance2').value));
        const angle2 = parseFloat(document.getElementById('angle2').value);
        
        validatePositiveInputs('distance1', 'distance2');
        
        if (!angle1 || angle1 <= 0 || angle1 >= 90 || !angle2 || angle2 <= 0 || angle2 >= 90) {
            throw new Error('Please enter valid angles (between 0 and 90 degrees)');
        }
        
        // Convert angles to radians
        const angle1Rad = angle1 * Math.PI / 180;
        const angle2Rad = angle2 * Math.PI / 180;
        
        // Calculate heights from both positions
        const height1 = distance1 * Math.tan(angle1Rad);
        const height2 = distance2 * Math.tan(angle2Rad);
        
        // Return the average of the two heights for better accuracy
        return (height1 + height2) / 2;
    }
    
    // Helper function to validate inputs
    function validatePositiveInputs(...inputIds) {
        inputIds.forEach(id => {
            const input = document.getElementById(id);
            const value = parseFloat(input.value);
            
            if (!value || value <= 0) {
                throw new Error(`Please enter a valid positive value for ${input.previousElementSibling.textContent.replace(':', '')}`);
            }
        });
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        saveResults.classList.add('hidden');
    }

    function clearError() {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
        saveResults.classList.add('hidden');
    }
    
    // Save results handlers
    document.getElementById('printResults').addEventListener('click', function() {
        window.print();
    });
    
    document.getElementById('downloadPDF').addEventListener('click', function() {
        alert('PDF download feature will be implemented in the next update.');
    });
    
    document.getElementById('emailResults').addEventListener('click', function() {
        const treeHeight = resultArea.querySelector('strong').textContent;
        const subject = 'Tree Height Measurement Result';
        const body = `I measured a tree height of ${treeHeight} using the ${currentMethod} method on Given's Fire and Forestry Tree Height Calculator.`;
        
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
    
    // Initialize the unit selectors
    updateUnitTypeOptions();
    updateUnitLabels();
    
    // Set default method and tab
    setActiveTab('standard');
    angleMethod.click();
});