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
    const sequenceNumber = genderCode === 'female' 
      ? generateRandomNumber(0, 4999).toString().padStart(4, '0') 
      : generateRandomNumber(5000, 9999).toString().padStart(4, '0');
  
    const citizenship = generateRandomNumber(0, 1);
    const raceIndicator = generateRandomNumber(8, 9);
  
    const idWithoutCheckDigit = `${year}${month}${day}${sequenceNumber}${citizenship}${raceIndicator}`;
    const checkDigit = calculateCheckDigit(idWithoutCheckDigit);
  
    return idWithoutCheckDigit + checkDigit;
  }
  
  function showSingleId() {
    const form = document.forms.f1;
    const year = form.year.value.slice(2);
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
  
  function addOptions(id, from, to, defaultValue) {
    const selectElement = document.getElementById(id);
    const values = Array.from({ length: to - from + 1 }, (_, i) => i + from);
    const options = values.map(v => {
      const isDefault = defaultValue && defaultValue === String(v);
      return `<option value="${v}" ${isDefault ? 'selected="selected"' : ''}>${v}</option>`;
    }).join('');
    selectElement.innerHTML = options;
  }
  
  window.onload = () => {
    const year = new Date().getFullYear();
    addOptions('year', 1900, year, year);
    addOptions('month', 1, 12);
    addOptions('day', 1, 31);
  };
  