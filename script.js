function calculateCheckDigit(digitsAsString) {
    const digits = digitsAsString.split('').map(d => Number(d));
    let sum = 0;
  
    for (let i = 0; i < digits.length; i++) {
      let digit = digits[i];
      if (i % 2 !== 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
  
    return (10 - (sum % 10)) % 10;
  }
  
  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function generateIdNumber(year, month, day, genderCode) {
    // Generate random GSSS (Sequence number: 0000-4999 for females, 5000-9999 for males)
    const sequenceNumber = genderCode === 'female' ? generateRandomNumber(0, 4999).toString().padStart(4, '0') :
      generateRandomNumber(5000, 9999).toString().padStart(4, '0');
  
    const citizenship = generateRandomNumber(0, 1); // Randomly 0 or 1
    const raceIndicator = generateRandomNumber(8, 9); // Randomly 8 or 9
  
    const idWithoutCheckDigit = `${year}${month}${day}${sequenceNumber}${citizenship}${raceIndicator}`;
    const checkDigit = calculateCheckDigit(idWithoutCheckDigit);
  
    return idWithoutCheckDigit + checkDigit;
  }
  
  function showSingleId() {
    const form = document.forms.f1;
    const year = form.year.value.slice(2); // Extract last 2 digits of the year
    const month = form.month.value.padStart(2, '0');
    const day = form.day.value.padStart(2, '0');
    const gender = form.gender.value;
  
    const idNumber = generateIdNumber(year, month, day, gender);
    document.getElementById('result').innerHTML = `<p><strong>Generated ID:</strong> ${idNumber}</p>`;
  }
  
  function generateMultipleIds() {
    const form = document.forms.f1;
    const year = form.year.value.slice(2);
    const month = form.month.value.padStart(2, '0');
    const day = form.day.value.padStart(2, '0');
    const idCount = document.getElementById('idCount').value;
  
    const ids = [];
  
    for (let i = 0; i < idCount; i++) {
      const gender = Math.random() > 0.5 ? 'female' : 'male';
      const idNumber = generateIdNumber(year, month, day, gender);
      ids.push(idNumber);
    }
  
    const file = new Blob([ids.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = 'generated-ids.txt';
    a.click();
  }
  
  function addYearOptions(id, from, to) {
    const selectElement = document.getElementById(id);
    const currentYear = new Date().getFullYear();
    
    let options = '';
    for (let year = to; year >= from; year--) {
      const age = currentYear - year;
      options += `<option value="${year}">${year} (~${age} years old)</option>`;
    }
    
    selectElement.innerHTML = options;
  }
  
  function addOptions(id, from, to, defaultValue) {
    const selectElement = document.getElementById(id);
    const values = Array.from({ length: to - from + 1 }, (_, i) => i + from);
    const options = values.map(v => {
      const isDefault = defaultValue && defaultValue === String(v);
      return `<option value="${v}" ${isDefault ? 'selected="selected"' : ''}>${v}</option>`;
    }).join('');
    selectElement.innerHTML = options;
  }
  
  function updateYearDisplay() {
    const yearSelect = document.getElementById('year');
    const selectedYear = yearSelect.value;
    const currentYear = new Date().getFullYear();
    const age = currentYear - selectedYear;
    const yearText = `${selectedYear} (~${age} years old)`;
  
    const yearOption = yearSelect.querySelector(`option[value="${selectedYear}"]`);
    if (yearOption) {
      yearOption.textContent = yearText;
    }
  }
  
  function updateMonthDisplay() {
    const monthSelect = document.getElementById('month');
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
    const selectedMonth = parseInt(monthSelect.value, 10);
    const monthText = `${selectedMonth} (${monthNames[selectedMonth - 1]})`;
  
    const monthOption = monthSelect.querySelector(`option[value="${selectedMonth}"]`);
    if (monthOption) {
      monthOption.textContent = monthText;
    }
  }
  
  window.onload = () => {
    const year = new Date().getFullYear();
    addYearOptions('year', 1900, year); // Add year options with year and age display
    addOptions('month', 1, 12);
    addOptions('day', 1, 31);
  
    updateYearDisplay(); // Initialize display for the current year
    updateMonthDisplay(); // Initialize display for the current month
  };
  