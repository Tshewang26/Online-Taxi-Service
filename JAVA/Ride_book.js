// Global variables
let selectedVehicle = '';
let selectedTaxi = null;
let selectedSeatsPositions = [];
let bookingSummaryHtml = '';
let selectedPaymentMethod = '';
// 1: Vehicle/Form, 2: Taxis, 3: Seats, 4: Payment, 5: Confirmation
let currentStep = 1;

// Mock Account Info for Online Payment
const DRIVER_ACCOUNT_INFO = {
    bank: 'Bhutan National Bank (BNB)',
    account: '1000100020003000'
};

// Defines the fixed set of seats in a standard car, and which ones are window seats.
const SEAT_POSITIONS = [
    { name: 'Front Passenger', isWindow: true },
    { name: 'Rear Window Left', isWindow: true },
    { name: 'Rear Middle', isWindow: false },
    { name: 'Rear Window Right', isWindow: true },
    // Add more placeholders for larger vehicles
    { name: 'Back Row Left', isWindow: true },
    { name: 'Back Row Middle', isWindow: false },
    { name: 'Back Row Right', isWindow: true }
];

// --- Mock Taxi Data ---
const mockTaxis = [
    { id: 'E101', type: '4-seater', driver: 'Tashi Wangchuk', car: 'Alto K10', plate: 'BG-A-214', capacity: 4, availableSeats: 4 },
    { id: 'E102', type: '4-seater', driver: 'Pema Lhamo', car: 'Hyundai Eon', plate: 'BG-A-875', capacity: 4, availableSeats: 2 },
    { id: 'C201', type: '7-seater', driver: 'Nima Dorji', car: 'Toyota Innova', plate: 'BG-B-009', capacity: 7, availableSeats: 7 },
    { id: 'C202', type: '7-seater', driver: 'Sonam Choden', car: 'SUV Deluxe', plate: 'BG-B-553', capacity: 7, availableSeats: 5 },
    { id: 'C203', type: '7-seater', driver: 'Jigme Singye', car: 'Mahindra XUV', plate: 'BG-B-121', capacity: 7, availableSeats: 7 },
    { id: 'P301', type: '8-seater', driver: 'Karma Tenzin', car: 'Tempo Traveller', plate: 'BG-C-400', capacity: 8, availableSeats: 8 },
    { id: 'P302', type: '8-seater', driver: 'Dawa Zangpo', car: 'Force Traveller', plate: 'BG-C-777', capacity: 8, availableSeats: 6 },
];

// DOM Elements
const vehicleCards = document.querySelectorAll('.vehicle-card');
const bookingFormWrapper = document.getElementById('booking-form-wrapper');
const availableTaxisSection = document.getElementById('available-taxis-section');
const seatSelectionSection = document.getElementById('seat-selection-section');
const paymentSelectionSection = document.getElementById('payment-selection-section');
const confirmationSection = document.getElementById('confirmation');
const errorMessage = document.getElementById('error-message');
const continueButton = document.querySelector('.btn-book');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
});

/**
 * Initialize form with default values
 */
function initializeForm() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const formattedTime = today.toTimeString().substring(0, 5);

    document.getElementById('date-input').value = formattedDate;
    document.getElementById('time-input').value = formattedTime;
}

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
    // Vehicle selection listener (Step 1 -> Step 2)
    vehicleCards.forEach(card => {
        card.addEventListener('click', function() {
            vehicleCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');

            selectedVehicle = this.dataset.vehicle;
            selectedTaxi = null;
            errorMessage.style.display = 'none';
        });
    });
}

/**
 * Logic to handle stepping back through the booking process.
 */
function handleBackNavigation() {
    errorMessage.style.display = 'none';

    // Ensure the main form is visible when navigating back from Step 4 or 5
    if (currentStep !== 5) {
        bookingFormWrapper.style.display = 'block';
        paymentSelectionSection.style.display = 'none';
        confirmationSection.classList.remove('show');
    }

    switch(currentStep) {
        case 1: // If on the initial form (Step 1), go to passenger_main.html
            window.location.href = 'passenger_main.html';
            break;
        case 2: // From Taxi Selection back to Vehicle Selection (Step 1)
            availableTaxisSection.classList.add('hidden-element');
            document.getElementById('vehicle-selection-section').classList.remove('hidden-element');
            continueButton.textContent = 'Continue';
            selectedTaxi = null;
            currentStep = 1;
            break;
        case 3: // From Seat Selection back to Taxi Selection (Step 2)
            seatSelectionSection.classList.add('hidden-element');
            displayAvailableTaxis(selectedVehicle, true);
            continueButton.textContent = 'Continue';
            currentStep = 2;
            break;
        case 4: // From Payment back to Seat Selection (Step 3)
            paymentSelectionSection.style.display = 'none';
            bookingFormWrapper.style.display = 'block';
            availableTaxisSection.classList.add('hidden-element');
            seatSelectionSection.classList.remove('hidden-element');
            continueButton.textContent = 'Continue to Payment';
            currentStep = 3;
            break;
        case 5: // From Confirmation back to Payment Selection (Step 4)
            confirmationSection.classList.remove('show');
            showPaymentSelection();
            currentStep = 4;
            break;
        default:
            window.location.href = 'passenger_main.html';
            break;
    }
}

/**
 * Filters mock taxis by vehicle type and renders them in the list (Step 2).
 */
function displayAvailableTaxis(vehicleType, keepSelection = false) {
    const taxiListContainer = document.getElementById('taxi-options');
    const vehicleLabel = document.getElementById('selected-vehicle-label');
    const vehicleSelectionSection = document.getElementById('vehicle-selection-section');

    taxiListContainer.innerHTML = '';

    // Hide previous step's elements
    vehicleSelectionSection.classList.add('hidden-element');

    // 1. Set the label
    const formattedType = vehicleType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
    vehicleLabel.textContent = formattedType;

    // 2. Filter available taxis
    const availableTaxis = mockTaxis.filter(t => t.type === vehicleType);

    if (availableTaxis.length === 0) {
        taxiListContainer.innerHTML = '<div style="padding: 10px; text-align: center; color: #777;">No taxis currently available for this type.</div>';
        availableTaxisSection.classList.remove('hidden-element');
        return;
    }

    // 3. Render cards
    availableTaxis.forEach(taxi => {
        const card = document.createElement('div');
        card.className = 'taxi-card';
        card.dataset.taxiId = taxi.id;

        // If returning from the seat selection step, highlight the previously selected taxi
        if (keepSelection && selectedTaxi && selectedTaxi.id === taxi.id) {
            card.classList.add('selected-taxi');
        }

        card.innerHTML = `
            <div class="taxi-details">
                <div class="driver-name">Driver: ${taxi.driver}</div>
                <div class="car-info">
                    ${taxi.car} 
                    (<span style="font-size: 12px; font-weight: 500; color: #888;">${taxi.plate}</span>) 
                    - Available Seats: ${taxi.availableSeats}
                </div>
            </div>
        `;

        // Add click listener to select the taxi (Step 2 -> Step 3)
        card.addEventListener('click', function() {
            document.querySelectorAll('.taxi-card').forEach(t => t.classList.remove('selected-taxi'));
            this.classList.add('selected-taxi');
            selectedTaxi = availableTaxis.find(t => t.id === this.dataset.taxiId);
            errorMessage.style.display = 'none';
        });

        taxiListContainer.appendChild(card);
    });

    // 4. Show the section and update button text
    availableTaxisSection.classList.remove('hidden-element');
    continueButton.textContent = 'Continue';
    currentStep = 2;
}

/**
 * Renders the visual seat selection grid (Step 3).
 */
function displaySeatSelection(availableCount, capacity) {
    const seatOptionsContainer = document.getElementById('seat-options');
    const seatLabel = document.getElementById('seat-selection-label');

    // Update label to show selected taxi and current selection count clearly.
    seatLabel.innerHTML = `
        <div style='font-size: 14px; color: #666; margin-bottom: 5px;'>
            Taxi: <strong>${selectedTaxi.car} (${selectedTaxi.plate})</strong> | Driver: ${selectedTaxi.driver}
        </div>
        Select your seats: <strong id="selected-seat-count">${selectedSeatsPositions.length}</strong> / ${availableCount} available seat(s)
    `;
    seatOptionsContainer.innerHTML = '';

    // Map standard seats, creating placeholders if capacity is larger than the default SEAT_POSITIONS array
    const seatsToRender = [];
    for (let i = 0; i < capacity; i++) {
        let seatInfo;
        if (i < SEAT_POSITIONS.length) {
            seatInfo = SEAT_POSITIONS[i];
        } else {
            // Placeholder for extra capacity
            seatInfo = { name: `Seat ${i + 1}`, isWindow: (i % 2 === 1) };
        }
        
        seatInfo.displayName = seatInfo.name;
        seatsToRender.push(seatInfo);
    }

    // Adjust grid columns based on capacity for better layout
    if (capacity <= 4) {
         seatOptionsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else if (capacity <= 7) {
         seatOptionsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else {
         seatOptionsContainer.style.gridTemplateColumns = 'repeat(5, 1fr)';
    }

    seatsToRender.forEach((seat, index) => {
        const card = document.createElement('div');
        card.className = 'seat-card';
        card.textContent = seat.displayName;
        card.dataset.seatName = seat.name;

        // Determine seat status and apply appropriate styling
        const isAvailable = index < availableCount;
        
        if (seat.isWindow) {
            card.classList.add('window-seat');
        }

        if (!isAvailable) {
            card.classList.add('unavailable');
            card.textContent = `${seat.displayName} (Booked)`;
        } else {
            card.classList.add('available');
            
            // Re-apply selection if exists
            if (selectedSeatsPositions.includes(seat.name)) {
                card.classList.add('selected-seat');
            }

            card.addEventListener('click', function() {
                errorMessage.style.display = 'none';

                if (this.classList.contains('selected-seat')) {
                    this.classList.remove('selected-seat');
                    selectedSeatsPositions = selectedSeatsPositions.filter(s => s !== seat.name);
                } else {
                    if (selectedSeatsPositions.length < availableCount) {
                        this.classList.add('selected-seat');
                        selectedSeatsPositions.push(seat.name);
                    } else {
                        errorMessage.textContent = `⚠️ You can only select up to ${availableCount} seat(s) in this taxi.`;
                        errorMessage.style.display = 'block';
                        setTimeout(() => errorMessage.style.display = 'none', 3000);
                    }
                }
                
                // Update the displayed count immediately on click
                document.getElementById('selected-seat-count').textContent = selectedSeatsPositions.length;
            });
        }
        seatOptionsContainer.appendChild(card);
    });

    seatSelectionSection.classList.remove('hidden-element');
    availableTaxisSection.classList.add('hidden-element');
    continueButton.textContent = 'Continue to Payment';
    currentStep = 3;
}

/**
 * Gathers all booking details and stores the structured HTML summary for later use.
 */
function prepareBookingSummary() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const pickup = document.getElementById('pickup').value;
    const dropoff = document.getElementById('dropoff').value;
    const dateValue = document.getElementById('date-input').value;
    const timeValue = document.getElementById('time-input').value;
    const datetime = `${dateValue}T${timeValue}:00`;

    const date = new Date(datetime);
    const formattedDate = date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    bookingSummaryHtml = `
        <hr style="margin: 10px 0; border: none; border-bottom: 1px solid #eee;">

        <p style="text-align: left; line-height: 1.6; margin-bottom: 5px;">
            <strong>Vehicle:</strong> ${selectedVehicle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')}<br>
            <strong>Driver:</strong> ${selectedTaxi.driver}<br>
            <strong>Car:</strong> ${selectedTaxi.car} (<span style="font-size: 13px; color: #777; font-weight: normal;">${selectedTaxi.plate}</span>)<br>
            <strong>Seats Booked:</strong> ${selectedSeatsPositions.length} (${selectedSeatsPositions.join(', ')})<br>
        </p>
        <hr style="margin: 10px 0; border: none; border-bottom: 1px solid #eee;">
        <p style="text-align: left; line-height: 1.6; padding-left: 0;">
            📍 From: ${pickup}<br>
            📍 To: ${dropoff}<br>
            🕐 ${formattedDate}<br>
            📱 ${phone}
        </p>
    `;
}

/**
 * Shows the payment selection screen (Step 3 -> Step 4).
 */
function showPaymentSelection() {
    bookingFormWrapper.style.display = 'none';
    paymentSelectionSection.style.display = 'block';
    currentStep = 4;
}

/**
 * Handles the payment method selection and shows the final confirmation (Step 4 -> Step 5).
 */
function handlePaymentSelection(method) {
    selectedPaymentMethod = method;
    const confirmationTitle = document.getElementById('confirmationTitle');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const confirmationDetails = document.getElementById('confirmationDetails');

    confirmationTitle.textContent = 'Booking Confirmed!';
    confirmationMessage.textContent = `Thank you for booking with RideNow. Your ride is confirmed.`;

    // Prepare the booking summary details
    prepareBookingSummary();

    // Build the final confirmation details
    let paymentDetails = '';
    if (method === 'Cash') {
        paymentDetails = `<p style="text-align: left; margin-top: 10px; color: #333;"><strong>Payment:</strong> Pay in cash to the driver upon arrival.</p>`;
    } else if (method === 'Online Payment') {
        paymentDetails = `
            <p style="text-align: left; margin-top: 10px; color: #333;">
                <strong>Payment:</strong> Online Payment<br>
                <strong>Bank:</strong> ${DRIVER_ACCOUNT_INFO.bank}<br>
                <strong>Account:</strong> ${DRIVER_ACCOUNT_INFO.account}<br>
                <em style="color: #666; font-size: 14px;">Please transfer the fare to this account before your trip.</em>
            </p>
        `;
    }

    confirmationDetails.innerHTML = bookingSummaryHtml + paymentDetails;

    // Show confirmation and hide payment selection
    paymentSelectionSection.style.display = 'none';
    confirmationSection.classList.add('show');
    currentStep = 5;
}

/**
 * Main form submission handler that progresses through the booking steps.
 */
function handleFormSubmission() {
    errorMessage.style.display = 'none';

    // Step 1: Validate form and vehicle selection
    if (currentStep === 1) {
        if (!validateForm()) {
            errorMessage.textContent = '⚠️ Please fill in all required fields.';
            errorMessage.style.display = 'block';
            return;
        }

        if (!selectedVehicle) {
            errorMessage.textContent = '⚠️ Please select a vehicle type.';
            errorMessage.style.display = 'block';
            return;
        }

        displayAvailableTaxis(selectedVehicle);
        return;
    }

    // Step 2: Validate taxi selection
    if (currentStep === 2) {
        if (!selectedTaxi) {
            errorMessage.textContent = '⚠️ Please select a taxi.';
            errorMessage.style.display = 'block';
            return;
        }

        displaySeatSelection(selectedTaxi.availableSeats, selectedTaxi.capacity);
        currentStep = 3;
        return;
    }

    // Step 3: Validate seat selection
    if (currentStep === 3) {
        if (selectedSeatsPositions.length === 0) {
            errorMessage.textContent = '⚠️ Please select at least one seat.';
            errorMessage.style.display = 'block';
            return;
        }

        showPaymentSelection();
        return;
    }
}

/**
 * Validates the initial form fields (Step 1).
 */
function validateForm() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const pickup = document.getElementById('pickup').value;
    const dropoff = document.getElementById('dropoff').value;
    const date = document.getElementById('date-input').value;
    const time = document.getElementById('time-input').value;

    return name && phone && pickup && dropoff && date && time;
}

/**
 * Resets the entire form for a new booking (Step 5 -> Step 1).
 */
function resetForm() {
    document.getElementById('bookingForm').reset();
    selectedVehicle = '';
    selectedTaxi = null;
    selectedSeatsPositions = [];
    selectedPaymentMethod = '';
    currentStep = 1;

    // Reset UI states
    vehicleCards.forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.taxi-card').forEach(t => t.classList.remove('selected-taxi'));
    document.querySelectorAll('.seat-card').forEach(s => s.classList.remove('selected-seat'));

    // Hide sections and show initial form
    confirmationSection.classList.remove('show');
    availableTaxisSection.classList.add('hidden-element');
    seatSelectionSection.classList.add('hidden-element');
    bookingFormWrapper.style.display = 'block';
    paymentSelectionSection.style.display = 'none';
    document.getElementById('vehicle-selection-section').classList.remove('hidden-element');
    continueButton.textContent = 'Continue';
    errorMessage.style.display = 'none';

    // Re-initialize form with current date/time
    initializeForm();
}