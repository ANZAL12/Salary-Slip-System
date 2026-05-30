export const getSalarySlipTemplate = (
  employeeName: string,
  month: string,
  year: string,
  employeeId: string
) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Salary Slip - ${month} ${year}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background-color: #EB0A1E; /* Toyota Red */
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px 20px;
      background-color: #ffffff;
    }
    .content p {
      margin: 10px 0;
    }
    .details-box {
      background-color: #f9f9f9;
      border: 1px solid #eeeeee;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .details-row {
      margin-bottom: 8px;
    }
    .details-label {
      font-weight: bold;
      color: #555555;
    }
    .footer {
      background-color: #f4f4f4;
      padding: 15px 20px;
      text-align: center;
      font-size: 12px;
      color: #777777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Toyota | Nippon Toyota</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${employeeName}</strong>,</p>
      
      <p>Your salary slip for <strong>${month} ${year}</strong> has been generated successfully.</p>
      
      <p>Please find the attached salary slip PDF for your reference and records.</p>
      
      <div class="details-box">
        <div class="details-row">
          <span class="details-label">Employee ID:</span> ${employeeId}
        </div>
        <div class="details-row">
          <span class="details-label">Month:</span> ${month}
        </div>
        <div class="details-row">
          <span class="details-label">Year:</span> ${year}
        </div>
      </div>
      
      <p>If you have any questions or discrepancies, please contact the HR department.</p>
      
      <p>Regards,<br>
      HR Department<br>
      Toyota</p>
    </div>
    <div class="footer">
      <p>&copy; ${year} Nippon Toyota. All rights reserved.</p>
      <p>This is an automated message. Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>
  `;
};
