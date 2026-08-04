import { Resend } from 'resend';
import { google } from 'googleapis';

const resend = new Resend(process.env.RESEND_API_KEY);

function getTimestamp() {
  return new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).replace(',', '');
}

async function appendToSheet(f) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const row = [
    getTimestamp(),                                                              // Timestamp
    f.firstName,                                                                 // First Name
    f.lastName,                                                                  // Last Name
    f.dateOfApplication,                                                         // Date of Application
    f.phone,                                                                     // Phone Number
    f.email,                                                                     // Email
    f.address,                                                                   // Present Address
    f.dob,                                                                       // Date of Birth
    f.ssn,                                                                       // Social Security Number
    f.emergencyContact,                                                          // Emergency Contact Name
    f.emergencyContactPhone,                                                     // Emergency Contact Phone
    f.position,                                                                  // Position
    Array.isArray(f.credentials) ? f.credentials.join(', ') : '',               // Credentials
    f.hoursPerWeek,                                                              // Hours Per Week
    Array.isArray(f.willingToWork) ? f.willingToWork.join(', ') : '',           // Shift Types
    Array.isArray(f.daysAvailable) ? f.daysAvailable.join(', ') : '',           // Days Available
    f.salaryDesired,                                                             // Salary Desired
    f.howDidYouHear,                                                             // How Did You Hear
    f.legallyEligible,                                                           // Legally Eligible
    f.appliedBefore,                                                             // Applied Before
    f.hasDriversLicense,                                                         // Has Driver's License
    f.licenseNumber,                                                             // License Number
    f.licenseState,                                                              // License State
    f.licenseType,                                                               // License Type
    f.reliableTransportation,                                                    // Reliable Transportation
    f.convicted,                                                                 // Convicted
    f.convictionDetails,                                                         // Conviction Details
    f.currentlyEmployed,                                                         // Currently Employed
    f.education,                                                                 // Education Level
    f.jobs?.[0]?.company,                                                        // Job 1 Company
    f.jobs?.[0]?.title,                                                          // Job 1 Title
    f.jobs?.[0]?.dates,                                                          // Job 1 Dates
    f.jobs?.[0]?.reasonLeaving,                                                  // Job 1 Reason Leaving
    f.jobs?.[1]?.company,                                                        // Job 2 Company
    f.jobs?.[1]?.title,                                                          // Job 2 Title
    f.jobs?.[1]?.dates,                                                          // Job 2 Dates
    f.jobs?.[1]?.reasonLeaving,                                                  // Job 2 Reason Leaving
    f.references?.[0]?.name,                                                     // Reference 1 Name
    f.references?.[0]?.phone,                                                    // Reference 1 Phone
    f.stateLicenses,                                                             // State Licenses
    f.eSignature,                                                                // E-Signature
    f.date,                                                                      // Signature Date
    (f.certifyTrue && f.authorizeInvestigation && f.atWillAgreement && f.applicationPeriod) ? 'Yes' : 'No', // Agreed to Terms
    f.confirmEmail,                                                              // Confirm Email
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Form Responses 1!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}

function buildEmailHtml(f) {
  const section = (title, rows) => `
    <h2 style="background:#1B3B6F;color:#fff;padding:10px 16px;border-radius:6px;font-size:15px;margin:24px 0 8px;">${title}</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;font-family:Arial,sans-serif;">
      ${rows.map(([label, val]) => `
        <tr>
          <td style="padding:7px 12px;border:1px solid #ddd;background:#f5f7fa;font-weight:600;width:35%;vertical-align:top;">${label}</td>
          <td style="padding:7px 12px;border:1px solid #ddd;vertical-align:top;">${val || '—'}</td>
        </tr>
      `).join('')}
    </table>
  `;

  return `
    <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;">
      <div style="background:#1B3B6F;padding:24px;border-radius:10px 10px 0 0;text-align:center;">
        <h1 style="color:#F5A623;margin:0;font-size:22px;">New Employment Application</h1>
        <p style="color:#fff;margin:8px 0 0;font-size:14px;">All Hours Home Healthcare LLC</p>
        <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:12px;">Received: ${getTimestamp()} ET</p>
      </div>
      <div style="padding:0 0 24px;background:#fff;border:1px solid #ddd;border-radius:0 0 10px 10px;">

        ${section('Personal Information', [
          ['First Name', f.firstName],
          ['Last Name', f.lastName],
          ['Date of Application', f.dateOfApplication],
          ['Present Address', f.address],
          ['Phone', f.phone],
          ['Email', f.email],
          ['Date of Birth', f.dob],
          ['SSN', f.ssn],
          ['Emergency Contact Name', f.emergencyContact],
          ['Emergency Contact Phone', f.emergencyContactPhone],
        ])}

        ${section('Position & Availability', [
          ['Position', f.position],
          ['Credentials', Array.isArray(f.credentials) ? f.credentials.join(', ') : ''],
          ['Salary Desired', f.salaryDesired],
          ['Languages', Array.isArray(f.languages) ? f.languages.join(', ') : ''],
          ['Hours/Week', f.hoursPerWeek],
          ['Shift Types', Array.isArray(f.willingToWork) ? f.willingToWork.join(', ') : ''],
          ['Days Available', Array.isArray(f.daysAvailable) ? f.daysAvailable.join(', ') : ''],
          ['Office Skills', Array.isArray(f.officeSkills) ? f.officeSkills.join(', ') : ''],
          ['How Did You Hear', f.howDidYouHear],
          ['Applied Before', f.appliedBefore],
          ['Legally Eligible', f.legallyEligible],
        ])}

        ${section('Background & Driving', [
          ["Driver's License", f.hasDriversLicense],
          ['License #', f.licenseNumber],
          ['License State', f.licenseState],
          ['License Type', f.licenseType],
          ['Accident History', f.accidentHistory],
          ['Reliable Transportation', f.reliableTransportation],
          ['Armed Forces', f.armedForces],
          ['National Guard', f.nationalGuard],
          ['Military Details', f.militaryDetails],
          ['Convicted', f.convicted],
          ['Conviction Details', f.convictionDetails],
        ])}

        ${section('Education & Work History', [
          ['Currently Employed', f.currentlyEmployed],
          ['Contact Current Employer', f.contactCurrentEmployer],
          ['Education', f.education],
          ['Field of Study', f.fieldOfStudy],
          ['Previous Last Name', f.previousName],
        ])}

        ${[0, 1, 2].filter(i => f.jobs?.[i]?.company).map(i => section(`Job ${i + 1}`, [
          ['Company', f.jobs[i].company],
          ['Phone', f.jobs[i].phone],
          ['Address', f.jobs[i].address],
          ['Dates', f.jobs[i].dates],
          ['Title', f.jobs[i].title],
          ['Description', f.jobs[i].description],
          ['Starting Pay', f.jobs[i].startingPay],
          ['Reason Leaving', f.jobs[i].reasonLeaving],
        ])).join('')}

        ${section('References & Licensing', [
          ['Capable of Job', f.capableOfJob],
          ["Requirement Can't Meet", f.jobRequirementCantMeet],
          ['State Licenses', f.stateLicenses],
          ['Special Skills', f.specialSkills],
        ])}

        ${[0, 1, 2].filter(i => f.references?.[i]?.name).map(i => section(`Reference ${i + 1}`, [
          ['Name', f.references[i].name],
          ['Address', f.references[i].address],
          ['Phone', f.references[i].phone],
        ])).join('')}

        ${section('Legal & Signature', [
          ['Agreed to All Terms', (f.certifyTrue && f.authorizeInvestigation && f.atWillAgreement && f.applicationPeriod) ? 'Yes' : 'No'],
          ['E-Signature', f.eSignature],
          ['Signature Date', f.date],
          ['Confirm Email', f.confirmEmail],
        ])}

      </div>
      <p style="text-align:center;font-size:12px;color:#999;margin-top:16px;">
        Submitted via AllHours Apply · ${getTimestamp()} ET
      </p>
    </div>
  `;
}

export async function POST(req) {
  try {
    const f = await req.json();

    await Promise.all([
      appendToSheet(f),
      resend.emails.send({
        from: 'Applications <onboarding@resend.dev>',
        to: process.env.HR_EMAIL,
        replyTo: f.email,
        subject: `New Application: ${f.firstName} ${f.lastName} — ${f.position || 'Position not specified'}`,
        html: buildEmailHtml(f),
      }),
    ]);

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}