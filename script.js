<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sequential SA ID Generator</title>
  <link rel="stylesheet" href="style.css">
  <script>
    // Function to calculate the checksum digit using the specified method
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

    // Function to generate sequential SA ID numbers based on selected year
    function generateSequentialIds() {
      const year = document.getElementById('year').value;
      const citizen = document.querySelector('input[name="citizenship"]:checked').value;
      const results = [];

      // Loop through months (1-12)
      for (let month = 1; month <= 12; month++) {
        // Get the number of days in the month
        const daysInMonth = new Date(year, month, 0).getDate();

        // Loop through days (1-31)
        for (let day = 1; day <= daysInMonth; day++) {
          // Loop through gender sequence numbers (0001 to 9999)
          for (let genderSeq = 1; genderSeq <= 9999; genderSeq++) {
            const genderStr = genderSeq.toString().padStart(4, '0');
            const citizenCode = citizen; // 0 for citizen, 1 for non-citizen
            const race = '8'; // Race indicator is always 8
            const yy = year.slice(-2);
            const mm = month.toString().padStart(2, '0');
            const dd = day.toString().padStart(2, '0');

            // Construct ID without the checksum
            const idWithoutCheck = yy + mm + dd + genderStr + citizenCode + race;
            const checksum = calculateCheckDigit(idWithoutCheck);
            const fullId = idWithoutCheck + checksum;

            results.push(fullId);
          }
        }
      }
      return results;
    }

    // Function to export the IDs as a text file
    function exportIdsAsTextFile() {
      const ids = generateSequentialIds();
      const blob = new Blob([ids.join('\n')], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `SA_IDs_${document.getElementById('year').value}.txt`;
      link.click();
    }

    // Populate the year select box with a range of years
    window.onload = function () {
      const yearSelect = document.getElementById('year');
      const currentYear = new Date().getFullYear();
      for (let i = currentYear; i >= 1900; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        yearSelect.add(option);
      }
    };
  </script>
</head>
<body>
  <div class="container">
    <h3>Sequential South-African ID Number Generator</h3>

    <form id="f2" name="f2" onsubmit="exportIdsAsTextFile(); return false;">
      <div class="input-group">
        <label for="year">Year of Birth</label>
        <select id="year" name="year"></select>
      </div>

      <div class="input-group">
        <input type="radio" name="citizenship" id="citizen" value="0" checked />
        <label for="citizen">Citizen</label><br />
        <input type="radio" name="citizenship" id="noncitizen" value="1" />
        <label for="noncitizen">Non-Citizen</label>
      </div>

      <div class="input-group">
        <button type="submit">Export Sequential IDs to Textfile</button>
      </div>
    </form>

    <div id="result"></div>

    <h3>How Sequential ID Generation Works</h3>
    <p>This tool generates all possible South African ID numbers for a selected year with:</p>
    <ul>
      <li><strong>YYMMDD</strong>: Date of birth (based on the selected year, month, and day)</li>
      <li><strong>GSSS</strong>: Gender (0-4999 for females, 5000-9999 for males)</li>
      <li><strong>C</strong>: Citizenship (0 for SA citizens, 1 for non-citizens)</li>
      <li><strong>A</strong>: Race indicator (always set to 8)</li>
      <li><strong>Z</strong>: Checksum digit (calculated using the Luhn algorithm)</li>
    </ul>
  </div>
</body>
</html>
