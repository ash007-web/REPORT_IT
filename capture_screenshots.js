import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const TARGET_DIR = 'C:\\Users\\adars\\OneDrive\\文档\\LAF\\ss';

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function captureAll() {
  console.log('Launching browser with Chrome channel...');
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome'
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();

  // 1. Login Page
  console.log('Capturing: 01_login.png...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(TARGET_DIR, '01_login.png'), fullPage: true });

  // 2. Student Dashboard
  console.log('Logging in as Student...');
  await page.fill('input[type="email"]', 'student@reportit.edu');
  await page.fill('input[type="password"]', 'student');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  console.log('Capturing: 01_home.png (Student Dashboard)...');
  await page.screenshot({ path: path.join(TARGET_DIR, '01_home.png'), fullPage: true });

  // 3. Report Form (Lost)
  console.log('Capturing: 02_report_form.png (Report Form)...');
  await page.goto('http://localhost:5173/report?type=lost', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(TARGET_DIR, '02_report_form.png'), fullPage: true });

  // 4. Browse Items
  console.log('Capturing: 04_browse_items.png...');
  await page.goto('http://localhost:5173/browse', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(TARGET_DIR, '04_browse_items.png'), fullPage: true });

  // 5. My Reports
  console.log('Capturing: 05_my_reports.png...');
  await page.goto('http://localhost:5173/my-reports', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(TARGET_DIR, '05_my_reports.png'), fullPage: true });

  // 6. Student Profile
  console.log('Capturing: 06_student_profile.png...');
  await page.goto('http://localhost:5173/profile', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(TARGET_DIR, '06_student_profile.png'), fullPage: true });

  // 7. Admin Dashboard
  console.log('Logging in as Admin...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.fill('input[type="email"]', 'admin@reportit.edu');
  await page.fill('input[type="password"]', 'admin');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  console.log('Capturing: 03_dashboard.png (Admin Overview Dashboard)...');
  await page.screenshot({ path: path.join(TARGET_DIR, '03_dashboard.png'), fullPage: true });

  // 8. Admin Manage Reports
  console.log('Capturing: 07_admin_manage_reports.png...');
  await page.goto('http://localhost:5173/admin/reports', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(TARGET_DIR, '07_admin_manage_reports.png'), fullPage: true });

  // 9. Admin Manage Users
  console.log('Capturing: 08_admin_manage_users.png...');
  await page.goto('http://localhost:5173/admin/users', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(TARGET_DIR, '08_admin_manage_users.png'), fullPage: true });

  // 10. Admin Profile
  console.log('Capturing: 09_admin_profile.png...');
  await page.goto('http://localhost:5173/profile', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(TARGET_DIR, '09_admin_profile.png'), fullPage: true });

  // 11. phpMyAdmin Captures
  console.log('Navigating to phpMyAdmin...');
  try {
    // Database schema overview
    console.log('Capturing: db_schema_overview.png...');
    await page.goto('http://localhost/phpmyadmin/index.php?route=/database/structure&db=report_it', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(TARGET_DIR, 'db_schema_overview.png'), fullPage: true });

    // Table: users structure
    console.log('Capturing: db_users.png...');
    await page.goto('http://localhost/phpmyadmin/index.php?route=/table/structure&db=report_it&table=users', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(TARGET_DIR, 'db_users.png'), fullPage: true });

    // Table: items structure
    console.log('Capturing: db_items.png...');
    await page.goto('http://localhost/phpmyadmin/index.php?route=/table/structure&db=report_it&table=items', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(TARGET_DIR, 'db_items.png'), fullPage: true });
  } catch (phpErr) {
    console.warn('Direct route navigation in phpMyAdmin encountered issue:', phpErr.message);
    console.log('Attempting general navigation to phpMyAdmin homepage...');
    await page.goto('http://localhost/phpmyadmin/', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(TARGET_DIR, 'db_phpmyadmin_home.png'), fullPage: true });
  }

  console.log('All captures complete!');
  await browser.close();
}

captureAll().catch(err => {
  console.error('Capture process error:', err);
  process.exit(1);
});
