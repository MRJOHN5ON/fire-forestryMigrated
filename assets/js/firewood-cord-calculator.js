document.addEventListener('DOMContentLoaded', () => {
    // Get references to all input fields
    const bottomDiameterInput = document.getElementById('bottomDiameter');
    const topDiameterInput = document.getElementById('topDiameter');
    const heightInput = document.getElementById('height');
    
    // Get references to result display elements
    const volumeElement = document.getElementById('volume');
    const cordsElement = document.getElementById('cords');
    
    // Add event listeners to all inputs
    const inputs = [bottomDiameterInput, topDiameterInput, heightInput];
    inputs.forEach(input => {
        input.addEventListener('input', calculateVolume);
    });
    
    // Function to calculate volume and cords
    function calculateVolume() {
        // Get input values, default to 0 if not provided
        const bottomDiameter = parseFloat(bottomDiameterInput.value) || 0;
        const topDiameter = parseFloat(topDiameterInput.value) || 0;
        const heightFeet = parseFloat(heightInput.value) || 0;
        
        // Input validation - ensure values are non-negative
        if (bottomDiameter < 0 || topDiameter < 0 || heightFeet < 0) {
            alert('Please enter positive values only.');
            return;
        }
        
        // Convert measurements
        const heightInches = heightFeet * 12;
        const bottomRadius = bottomDiameter / 2;
        const topRadius = topDiameter / 2;
        
        // Calculate volume in cubic inches
        // V = (1/3) * π * H * (Rb² + Rb*Rt + Rt²)
        const volume = (1/3) * Math.PI * heightInches * (
            Math.pow(bottomRadius, 2) + 
            bottomRadius * topRadius + 
            Math.pow(topRadius, 2)
        );
        
        // Convert volume to cords (1 cord = 128 cubic feet = 221,184 cubic inches)
        const cords = volume / 221184;
        
        // Display results with appropriate formatting
        volumeElement.textContent = `${volume.toFixed(2)} cubic inches`;
        cordsElement.textContent = `${cords.toFixed(4)} cords`;

        const cordsDisplay = document.getElementById('cordsDisplay');
        if (cordsDisplay) {
            cordsDisplay.textContent = cords > 0 ? cords.toFixed(2) : '0';
        }
        
        // Add visual feedback
        updateResultsDisplay(volume, cords);
    }
    
    // Function to update display styling based on values
    function updateResultsDisplay(volume, cords) {
        const resultsElement = document.getElementById('results');
        
        // If we have actual results to show
        if (volume > 0) {
            resultsElement.classList.add('has-results');
        } else {
            resultsElement.classList.remove('has-results');
        }
    }
    
    // Initialize calculations
    calculateVolume();
});