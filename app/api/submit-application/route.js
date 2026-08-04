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
    getTimestamp(),                                                    // Timestamp
    f.fullName,                                                        // Full Name
    f.dateOfApplication,                                               // Date of Application
    f.address,                                                         // Present Address
    f.phone,                                                           // Phone Number
    f.email,                                                           // E-mail
    f.ssn,                                                             // Social Security Number
    f.dob,                                                             // Date of Birth
    f.emergencyContact,                                                // Emergency Contact
    f.appliedBefore,                                                   // Applied Before
    f.legallyEligible,                                                 // Legally Eligible
    Array.isArray(f.languages) ? f.languages.join(', ') : f.languages,// Languages
    f.hoursPerWeek,                                                    // Hours Per Week
    Array.isArray(f.willingToWork) ? f.willingToWork.join(', ') : '',  // Willing to Work
    Array.isArray(f.daysAvailable) ? f.daysAvailable.join(', ') : '',  // Days Available
    f.position,                                                        // Position
    f.therapyType,                                                     // Therapy Type
    f.salaryDesired,                                                   // Salary Desired
    Array.isArray(f.officeSkills) ? f.officeSkills.join(', ') : '',    // Office Skills
    f.hasDriversLicense,                                               // Driver's License
    f.licenseNumber,                                                   // License Number
    f.licenseState,                                                    // License State
    f.licenseType,                                                     // License Type
    f.accidentHistory,                                                 // Accident History
    f.armedForces,                                                     // Armed Forces
    f.nationalGuard,                                                   // National Guard
    f.militaryDetails,                                                 // Military Details
    f.howDidYouHear,                                                   // How Did You Hear
    f.education,                                                       // Education Level
    f.fieldOfStudy,                                                    // Field of Study
    f.contactCurrentEmployer,                                          // Contact Current Employer
    f.jobs?.[0]?.company,                                              // Job 1 Company
    f.jobs?.[0]?.phone,                                                // Job 1 Phone
    f.jobs?.[0]?.address,                                              // Job 1 Address
    f.jobs?.[0]?.dates,                                                // Job 1 Dates
    f.jobs?.[0]?.title,                                                // Job 1 Title
    f.jobs?.[0]?.description,                                          // Job 1 Description
    f.jobs?.[0]?.startingPay,                                          // Job 1 Starting Pay
    f.jobs?.[0]?.reasonLeaving,                                        // Job 1 Reason Leaving
    f.jobs?.[1]?.company,                                              // Job 2 Company
    f.jobs?.[1]?.phone,                                                // Job 2 Phone
    f.jobs?.[1]?.address,                                              // Job 2 Address
    f.jobs?.[1]?.dates,                                                // Job 2 Dates
    f.jobs?.[1]?.title,                                                // Job 2 Title
    f.jobs?.[1]?.description,                                          // Job 2 Description
    f.jobs?.[1]?.reasonLeaving,                                        // Job 2 Reason Leaving
    f.jobs?.[1]?.startingPay,                                          // Job 2 Starting Pay
    f.jobs?.[2]?.company,                                              // Job 3 Company
    f.jobs?.[2]?.phone,                                                // Job 3 Phone
    f.jobs?.[2]?.address,                                              // Job 3 Address
    f.jobs?.[2]?.dates,                                                // Job 3 Dates
    f.jobs?.[2]?.title,                                                // Job 3 Title
    f.jobs?.[2]?.description,                                          // Job 3 Description
    f.jobs?.[2]?.reasonLeaving,                                        // Job 3 Reason Leaving
    f.jobs?.[2]?.startingPay,                                          // Job 3 Starting Pay
    f.lastNameDifferent,                                               // Last Name Different
    f.currentlyEmployed,                                               // Currently Employed
    f.reliableTransportation,                                          // Reliable Transportation
    f.convicted,                                                       // Convicted
    f.capableOfJob,                                                    // Capable of Job
    f.previousName,                                                    // Previous Name
    f.convictionDetails,                                               // Conviction Details
    f.jobRequirementCantMeet,                                          // Job Requirement Can't Meet
    f.references?.[0]?.name,                                           // Ref 1 Name
    f.references?.[0]?.address,                                        // Ref 1 Address
    f.references?.[0]?.phone,                                          // Ref 1 Phone
    f.references?.[1]?.name,                                           // Ref 2 Name
    f.references?.[1]?.address,                                        // Ref 2 Address
    f.references?.[1]?.phone,                                          // Ref 2 Phone
    f.references?.[2]?.name,                                           // Ref 3 Name
    f.references?.[2]?.address,                                        // Ref 3 Address
    f.references?.[2]?.phone,                                          // Ref 3 Phone
    f.stateLicenses,                                                   // State Licenses
    f.specialSkills,                                                   // Special Skills
    f.certifyTrue ? 'Yes' : 'No',                                      // Certify True
    f.authorizeInvestigation ? 'Yes' : 'No',                           // Authorize Investigation
    f.atWillAgreement ? 'Yes' : 'No',                                  // At Will Agreement
    f.applicationPeriod ? 'Yes' : 'No',                                // Application Period
    f.date,                                                            // Date
    f.eSignature,                                                      // E-Signature
    f.confirmEmail,                                                    // Confirm Email
    Array.isArray(f.credentials) ? f.credentials.join(', ') : '',      // Credentials
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
          ['Full Name', f.fullName],
          ['Date of Application', f.dateOfApplication],
          ['Present Address', f.address],
          ['Phone', f.phone],
          ['Email', f.email],
          ['SSN', f.ssn],
          ['Date of Birth', f.dob],
          ['Emergency Contact', f.emergencyContact],
        ])}

        ${section('Position & Availability', [
          ['Position', f.position],
          ['Therapy Type', f.therapyType],
          ['Credentials', Array.isArray(f.credentials) ? f.credentials.join(', ') : f.credentials],
          ['Salary Desired', f.salaryDesired],
          ['Languages', Array.isArray(f.languages) ? f.languages.join(', ') : f.languages],
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
          ['Previous Name', f.previousName],
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
          ['Certify True', f.certifyTrue ? 'Yes — agreed' : 'No'],
          ['Authorize Investigation', f.authorizeInvestigation ? 'Yes — agreed' : 'No'],
          ['At-Will Agreement', f.atWillAgreement ? 'Yes — agreed' : 'No'],
          ['45-Day Period', f.applicationPeriod ? 'Yes — agreed' : 'No'],
          ['E-Signature', f.eSignature],
          ['Date', f.date],
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
        subject: `New Application: ${f.fullName} — ${f.position || 'Position not specified'}`,
        html: buildEmailHtml(f),
      }),
    ]);

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}