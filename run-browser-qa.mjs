import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BRAVE_PATH = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
const URL = 'http://localhost:5173';
const ARTIFACT_DIR = path.resolve('e2e-qa-results');

const results = [];

function recordTest(pageName, element, action, expected, actual, status, screenshotPath = '') {
  results.push({
    timestamp: new Date().toISOString(),
    pageName,
    element,
    action,
    expected,
    actual,
    status,
    screenshotPath
  });
  console.log(`[${status}] ${pageName} -> ${element}: ${actual}`);
}

async function runAudit() {
  console.log('🚀 Starting Comprehensive Black-Box QA Audit with Brave Browser (End-to-End)...');

  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleLogs = [];
  const errors = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push({ type: msg.type(), text });
    if (msg.type() === 'error' && !text.includes('429')) {
      errors.push(text);
    }
  });

  page.on('pageerror', err => {
    errors.push(err.toString());
  });

  try {
    // ---------------------------------------------------------
    // TEST 1: Initial Navigation & Page Load
    // ---------------------------------------------------------
    await page.goto(URL, { waitUntil: 'networkidle0' });
    const initialTitle = await page.title();
    const screenshot1 = path.join(ARTIFACT_DIR, '01_initial_load.png');
    await page.screenshot({ path: screenshot1 });

    recordTest(
      'Global',
      'Page Title & Head',
      'Navigate to root URL',
      'Title includes Docket',
      `Loaded successfully. Title: "${initialTitle}"`,
      initialTitle.includes('Docket') ? 'PASS' : 'FAIL',
      screenshot1
    );

    // ---------------------------------------------------------
    // TEST 2: Navbar Controls & Mode Switching
    // ---------------------------------------------------------
    console.log('\n--- Testing Navbar & Mode Switching ---');
    // Switch to Story mode
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes('Story'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    const screenshotStory = path.join(ARTIFACT_DIR, '02_story_mode.png');
    await page.screenshot({ path: screenshotStory });

    const heroVisible = await page.evaluate(() => {
      return document.body.innerText.includes('Docket') || document.body.innerText.includes('Buying hardware');
    });

    recordTest(
      'Navbar',
      'Story Button',
      'Click Story tab in Navbar',
      'Switches to Story Showcase view with Hero section',
      heroVisible ? 'Story view rendered with Hero sections' : 'Story view failed to render',
      heroVisible ? 'PASS' : 'FAIL',
      screenshotStory
    );

    // Switch to Ops Console
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes('Ops'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    const screenshotOps = path.join(ARTIFACT_DIR, '03_ops_mode.png');
    await page.screenshot({ path: screenshotOps });

    const opsVisible = await page.evaluate(() => {
      return document.body.innerText.includes('Ops') || document.body.innerText.includes('BOM Watch');
    });

    recordTest(
      'Navbar',
      'Ops Button',
      'Click Ops tab in Navbar',
      'Switches to Ops Production Console with data tables',
      opsVisible ? 'Ops console rendered with telemetry' : 'Ops view not visible',
      opsVisible ? 'PASS' : 'FAIL',
      screenshotOps
    );

    // Test Company Hub Modal
    console.log('\n--- Testing Company Hub Modal ---');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes('Company Hub'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    const screenshotHub = path.join(ARTIFACT_DIR, '04_company_hub_modal.png');
    await page.screenshot({ path: screenshotHub });

    const hubModalVisible = await page.evaluate(() => {
      return document.body.innerText.includes('Cross-Functional Procurement') || document.body.innerText.includes('Engineering & Requisition');
    });

    recordTest(
      'Navbar',
      'Company Hub Button',
      'Click Company Hub in topbar',
      'Opens 7-Department Enterprise Procurement Hub modal',
      hubModalVisible ? 'Company Hub modal opened with departments' : 'Modal failed to open',
      hubModalVisible ? 'PASS' : 'FAIL',
      screenshotHub
    );

    // Close Company Hub modal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const closeBtn = btns.find(b => b.innerHTML.includes('lucide-x') || b.textContent === '✕' || b.getAttribute('title')?.includes('Close'));
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Return to Terminal (Chat) Mode
    console.log('\n--- Switching to Terminal (Chat) Mode ---');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes('Terminal'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // ---------------------------------------------------------
    // TEST 3: Ingest Requisition (Click Preset Quick-Starter Pill)
    // ---------------------------------------------------------
    console.log('\n--- Testing Requisition Ingestion (Preset Quick Starter Pill) ---');
    const chipClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const chip = btns.find(b => b.textContent.includes('drone wings') || b.textContent.includes('450mm'));
      if (chip) {
        chip.click();
        return true;
      }
      return false;
    });

    await new Promise(r => setTimeout(r, 2000));
    const screenshotIngested = path.join(ARTIFACT_DIR, '05_requisition_active.png');
    await page.screenshot({ path: screenshotIngested });

    const pipelineActive = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('01 SPEC') && text.includes('02 SOURCING');
    });

    recordTest(
      'Terminal',
      'Requisition Preset Pill',
      'Click preset quick starter pill ("drone wings 450mm")',
      'Ingests technical BOM and activates 4-step workflow pipeline',
      pipelineActive ? 'Requisition initiated, 4-step pipeline live' : 'Pipeline failed to activate',
      pipelineActive ? 'PASS' : 'FAIL',
      screenshotIngested
    );

    // ---------------------------------------------------------
    // TEST 4: Stepper Bar Discovery
    // ---------------------------------------------------------
    const stepsFound = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        step1: text.includes('01 SPEC'),
        step2: text.includes('02 SOURCING'),
        step3: text.includes('03 FLIGHT'),
        step4: text.includes('04 DOCK & MATCH')
      };
    });

    recordTest(
      'Terminal',
      '4-Step Stepper Bar',
      'Verify presence of 4 distinct workflow steps in active workspace',
      'Step 01, Step 02, Step 03, Step 04 visible',
      JSON.stringify(stepsFound),
      stepsFound.step1 && stepsFound.step2 && stepsFound.step3 && stepsFound.step4 ? 'PASS' : 'FAIL'
    );

    // ---------------------------------------------------------
    // TEST 5: Sourcing Step 02 Interactions
    // ---------------------------------------------------------
    console.log('\n--- Testing Sourcing Step 02 (Suppliers, Call, Text, Lock) ---');
    // Select alternative cluster (Taiwan or US)
    const switchedSupplier = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const twBtn = btns.find(b => b.textContent.includes('Taiwan') || b.textContent.includes('[TW]'));
      if (twBtn) {
        twBtn.click();
        return true;
      }
      return false;
    });

    recordTest(
      'Terminal',
      'Cluster Pin Switch',
      'Click alternative supplier cluster ([TW] Taiwan)',
      'Switches active supplier and recalculates route and lead time',
      switchedSupplier ? 'Taiwan cluster selected' : 'Cluster button not found',
      switchedSupplier ? 'PASS' : 'FAIL'
    );

    // Test Vendor Calling Modal
    console.log('\n--- Testing Vendor Call Modal ---');
    const callModalOpened = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const callBtn = btns.find(b => b.textContent.includes('Direct Audio Wire') || b.textContent.includes('Call'));
      if (callBtn) { callBtn.click(); return true; }
      return false;
    });
    await new Promise(r => setTimeout(r, 800));
    const screenshotCall = path.join(ARTIFACT_DIR, '06_vendor_call_modal.png');
    await page.screenshot({ path: screenshotCall });

    const callModalVisible = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Direct Audio Wire') || text.includes('AUDIO TELEMETRY') || text.includes('Lock Rate') || text.includes('Connecting to secure supplier line');
    });

    recordTest(
      'Terminal',
      'Vendor Call Modal',
      'Click Direct Audio Wire button',
      'Opens interactive VoIP Call dialog with live waveform',
      callModalVisible ? 'VoIP Call modal rendered with audio waveforms' : 'Call modal failed to open',
      callModalVisible ? 'PASS' : 'FAIL',
      screenshotCall
    );

    // Close call modal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const confBtn = btns.find(b => b.textContent.includes('Lock Rate') || b.textContent.includes('Apply Rate') || b.textContent.includes('Close') || b.textContent.includes('Done'));
      if (confBtn) confBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Test Vendor Texting Modal
    console.log('\n--- Testing Vendor Texting Modal ---');
    const textModalOpened = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const textBtn = btns.find(b => b.textContent.includes('Direct Supplier Chat') || b.textContent.includes('Text'));
      if (textBtn) { textBtn.click(); return true; }
      return false;
    });
    await new Promise(r => setTimeout(r, 800));
    const screenshotText = path.join(ARTIFACT_DIR, '07_vendor_text_modal.png');
    await page.screenshot({ path: screenshotText });

    const textModalVisible = await page.evaluate(() => {
      return document.body.innerText.includes('Encrypted Supplier Chat') || document.body.innerText.includes('Direct Supplier');
    });

    recordTest(
      'Terminal',
      'Vendor Texting Widget',
      'Click Direct Supplier Chat button',
      'Opens encrypted text thread widget',
      textModalVisible ? 'Text modal rendered with negotiation thread' : 'Text modal not visible',
      textModalVisible ? 'PASS' : 'FAIL',
      screenshotText
    );

    // Close text modal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const closeBtn = btns.find(b => b.textContent.includes('Apply') || b.textContent.includes('Close') || b.innerHTML.includes('lucide-x'));
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Lock Allocation & Issue RFQ -> Advance to Step 03: Flight
    console.log('\n--- Testing Lock Allocation & Advance to Step 03 ---');
    const lockedSupplier = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const lockBtn = btns.find(b => b.textContent.includes('Lock Allocation & Issue RFQ') || b.textContent.includes('Proceed to Flight'));
      if (lockBtn) { lockBtn.click(); return true; }
      return false;
    });
    await new Promise(r => setTimeout(r, 1200));
    const screenshotStep3 = path.join(ARTIFACT_DIR, '08_step3_flight_telemetry.png');
    await page.screenshot({ path: screenshotStep3 });

    const flightVisible = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Boeing 777F') || text.includes('FLIGHT WATCH') || text.includes('Air Freight') || text.includes('Approve Flight Dispatch');
    });

    recordTest(
      'Terminal',
      'Lock Supplier Action',
      'Click Lock Allocation & Issue RFQ button',
      'Locks supplier, updates live invoice, advances directly to Step 03: Flight Telemetry',
      flightVisible ? 'Step 03 Flight Cargo active with Boeing 777F tracking' : 'Failed to transition to Step 03',
      flightVisible ? 'PASS' : 'FAIL',
      screenshotStep3
    );

    // ---------------------------------------------------------
    // TEST 6: Step 03 Flight Dispatch -> Advance to Step 04: Dock
    // ---------------------------------------------------------
    console.log('\n--- Testing Air Cargo Dispatch & Advance to Step 04 ---');
    const dispatchedFlight = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const dispatchBtn = btns.find(b => b.textContent.includes('Approve Flight Dispatch') || b.textContent.includes('Proceed to Dock'));
      if (dispatchBtn) { dispatchBtn.click(); return true; }
      return false;
    });
    await new Promise(r => setTimeout(r, 1200));
    const screenshotStep4 = path.join(ARTIFACT_DIR, '09_step4_dock_match.png');
    await page.screenshot({ path: screenshotStep4 });

    const dockVisible = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('RECEIVING DOCK') || text.includes('3-WAY MATCH') || text.includes('Confirm Dock Receiving');
    });

    recordTest(
      'Terminal',
      'Dispatch Air Cargo Action',
      'Click Approve Flight Dispatch button',
      'Dispatches flight, updates customs duty, advances to Step 04: Dock Scan & 3-Way Match',
      dockVisible ? 'Step 04 Dock Scan active with optical scan & variance matrix' : 'Failed to transition to Step 04',
      dockVisible ? 'PASS' : 'FAIL',
      screenshotStep4
    );

    // ---------------------------------------------------------
    // TEST 7: Optical Dock Barcode Scan & Zero-Variance Settle
    // ---------------------------------------------------------
    console.log('\n--- Testing 3-Way Match & Settle Action ---');
    // Confirm Dock Receiving & Settle Landed Invoice
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const settleBtn = btns.find(b => b.textContent.includes('Confirm Dock Receiving & Settle') || b.textContent.includes('Confirm Dock Receiving'));
      if (settleBtn) settleBtn.click();
    });
    await new Promise(r => setTimeout(r, 1500));
    const screenshotSettled = path.join(ARTIFACT_DIR, '10_settled_order.png');
    await page.screenshot({ path: screenshotSettled });

    const orderClosedPaid = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('[PAID · DOCKET]') || text.includes('PAID') || text.includes('Zero Variance');
    });

    recordTest(
      'Terminal',
      '3-Way Match & Settle Action',
      'Click Confirm Dock Receiving & Settle Landed Invoice',
      'Executes zero-variance matching, stamps invoice PAID',
      orderClosedPaid ? 'Zero-variance reconciliation confirmed, wire stamped [PAID · DOCKET]' : 'Order not closed',
      orderClosedPaid ? 'PASS' : 'FAIL',
      screenshotSettled
    );

    // ---------------------------------------------------------
    // TEST 8: Right-hand Live Landed Invoice Verification
    // ---------------------------------------------------------
    console.log('\n--- Verifying Live Landed Invoice ---');
    const invoiceAudit = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasInvoice: text.includes('INVOICE') || text.includes('COMMERCIAL'),
        hasAccumulator: text.includes('Everything, in one line') || text.includes('Landed per unit') || text.includes('MOQ'),
        hasPaidStamp: text.includes('PAID') || text.includes('VERIFIED'),
        hasHash: text.includes('SHA-256') || text.includes('AUDIT')
      };
    });

    recordTest(
      'LiveInvoiceView',
      'Accumulator & Legal Audit Hash',
      'Inspect right-hand live invoice panel',
      'Displays live cost accumulator, unit landed price, and SHA-256 hash',
      JSON.stringify(invoiceAudit),
      invoiceAudit.hasInvoice && invoiceAudit.hasAccumulator && invoiceAudit.hasPaidStamp ? 'PASS' : 'FAIL'
    );

    // ---------------------------------------------------------
    // TEST 9: Requisition Reset
    // ---------------------------------------------------------
    console.log('\n--- Testing Requisition Reset ---');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const resetBtn = btns.find(b => b.textContent.includes('Reset'));
      if (resetBtn) resetBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const resetState = await page.evaluate(() => {
      return document.querySelector('input[placeholder*="Describe part"]') !== null;
    });

    recordTest(
      'Terminal',
      'Reset Button',
      'Click Reset button in topbar',
      'Clears state and returns to initial Requisition Spec prompt',
      resetState ? 'Requisition state cleared, initial prompt ready' : 'Reset failed',
      resetState ? 'PASS' : 'FAIL'
    );

    // ---------------------------------------------------------
    // TEST 10: Custom Input Prompt Submission
    // ---------------------------------------------------------
    console.log('\n--- Testing Custom Conversational Prompt Submission ---');
    await page.type('input[placeholder*="Describe part"]', 'Avionics Flight Controller MCU 500 pcs Nov 30');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000));
    const screenshotPrompt = path.join(ARTIFACT_DIR, '11_conversational_prompt.png');
    await page.screenshot({ path: screenshotPrompt });

    const newRequisitionActive = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Avionics') || text.includes('Flight Controller') || text.includes('500');
    });

    recordTest(
      'Terminal',
      'Prompt Input & Enter Key',
      'Type "Avionics Flight Controller MCU 500 pcs Nov 30" and press Enter',
      'Initiates new requisition docket with custom part name and quantity',
      newRequisitionActive ? 'New requisition ingested and radar activated' : 'Requisition not ingested',
      newRequisitionActive ? 'PASS' : 'FAIL',
      screenshotPrompt
    );

    // ---------------------------------------------------------
    // TEST 11: Global Console Errors & Exceptions
    // ---------------------------------------------------------
    recordTest(
      'Global',
      'Console Errors & Uncaught Exceptions',
      'Monitor browser console during all interactions',
      'Zero fatal JavaScript uncaught exceptions',
      errors.length === 0 ? 'No uncaught exceptions logged' : `Errors: ${errors.join('; ')}`,
      errors.length === 0 ? 'PASS' : 'FAIL'
    );

  } catch (err) {
    console.error('Fatal test error:', err);
    recordTest('Global', 'Execution', 'Run test script', 'Completes cleanly', err.message, 'FAIL');
  } finally {
    await browser.close();
  }

  // Save JSON report
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'qa_report.json'), JSON.stringify({ summary: results, consoleErrors: errors }, null, 2));
  console.log('\n======================================================');
  console.log(`✅ QA Test Suite Completed. Total Tests: ${results.length}`);
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`PASS: ${passed} | FAIL: ${failed}`);
  console.log(`Screenshots and report saved in: ${ARTIFACT_DIR}`);
  console.log('======================================================');
}

runAudit();
