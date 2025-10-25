const fs = require('fs');
const path = require('path');

describe('LICENSE file', () => {
  const licensePath = path.join(__dirname, '..', 'LICENSE');
  let licenseContent;

  beforeAll(() => {
    licenseContent = fs.readFileSync(licensePath, 'utf8');
  });

  test('LICENSE file exists', () => {
    expect(fs.existsSync(licensePath)).toBe(true);
  });

  test('LICENSE file is not empty', () => {
    expect(licenseContent.length).toBeGreaterThan(0);
  });

  test('LICENSE contains MIT License section', () => {
    expect(licenseContent).toContain('MIT License');
  });

  test('LICENSE contains copyright notice', () => {
    expect(licenseContent).toContain('Copyright (c) 2025 WSB University - Problem Based Learning');
  });

  test('LICENSE contains permission text', () => {
    expect(licenseContent).toContain('Permission is hereby granted, free of charge');
  });

  test('LICENSE contains third-party assets section', () => {
    expect(licenseContent).toContain('Third-Party Assets');
  });

  test('LICENSE mentions Lunchtype24 Font', () => {
    expect(licenseContent).toContain('Lunchtype24 Font');
  });

  test('LICENSE mentions SIL Open Font License', () => {
    expect(licenseContent).toContain('SIL Open Font License');
    expect(licenseContent).toContain('OFL');
  });

  test('LICENSE credits Stefan Wetterstrand as font author', () => {
    expect(licenseContent).toContain('Stefan Wetterstrand');
  });

  test('LICENSE contains OFL license URL', () => {
    expect(licenseContent).toContain('https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL');
  });
});
