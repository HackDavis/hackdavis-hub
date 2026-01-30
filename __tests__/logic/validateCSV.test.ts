import validateCSV from '@actions/logic/validateCSV';
import { validateCsvBlob } from '@utils/csv-ingestion/csvAlgorithm';
import ParsedRecord from '@typeDefs/parsedRecord';

// Mock the validateCsvBlob function
jest.mock('@utils/csv-ingestion/csvAlgorithm', () => ({
  validateCsvBlob: jest.fn(),
}));

const mockValidateCsvBlob = validateCsvBlob as jest.MockedFunction<
  typeof validateCsvBlob
>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('validateCSV', () => {
  it('should return error when no file is provided', async () => {
    const formData = new FormData();

    const result = await validateCSV(formData);

    expect(result.ok).toBe(false);
    expect(result.body).toBe(null);
    expect(result.validBody).toBe(null);
    expect(result.report).toBe(null);
    expect(result.error).toBe('Missing file');
    expect(mockValidateCsvBlob).not.toHaveBeenCalled();
  });

  it('should delegate to validateCsvBlob with a valid file', async () => {
    const mockCsvContent =
      'Table Number,Project Title,Track #1\n1,Test Project,Track A';
    const file = new File([mockCsvContent], 'test.csv', { type: 'text/csv' });
    const formData = new FormData();
    formData.append('file', file);

    const mockTeams: ParsedRecord[] = [
      {
        name: 'Test Project',
        teamNumber: 1,
        tableNumber: 1,
        tracks: ['Track A'],
        active: true,
      },
    ];

    const mockValidationResponse = {
      ok: true,
      body: mockTeams,
      validBody: mockTeams,
      report: {
        totalTeamsParsed: 1,
        validTeams: 1,
        errorRows: 0,
        warningRows: 0,
        unknownTracks: [],
        issues: [],
      },
      error: null,
    };

    mockValidateCsvBlob.mockResolvedValue(mockValidationResponse);

    const result = await validateCSV(formData);

    expect(mockValidateCsvBlob).toHaveBeenCalledTimes(1);
    expect(mockValidateCsvBlob).toHaveBeenCalledWith(expect.any(Blob));
    expect(result).toEqual(mockValidationResponse);
  });

  it('should handle validation errors from validateCsvBlob', async () => {
    const mockCsvContent =
      'Table Number,Project Title,Track #1\n,Invalid,BadTrack';
    const file = new File([mockCsvContent], 'invalid.csv', {
      type: 'text/csv',
    });
    const formData = new FormData();
    formData.append('file', file);

    const mockValidationResponse = {
      ok: false,
      body: null,
      validBody: null,
      report: {
        totalTeamsParsed: 1,
        validTeams: 0,
        errorRows: 1,
        warningRows: 0,
        unknownTracks: ['BadTrack'],
        issues: [
          {
            rowIndex: 1,
            teamNumberRaw: '',
            severity: 'error' as const,
            invalidTracks: ['BadTrack'],
            excludedTracks: [],
            duplicateTracks: [],
            autoFixedTracks: [],
            missingFields: ['Table Number'],
            contactEmails: [],
            contactNames: [],
            memberEmails: [],
            memberNames: [],
            memberColumnsFromTeamMember1: [],
          },
        ],
      },
      error: 'CSV validation failed. Fix errors and re-validate.',
    };

    mockValidateCsvBlob.mockResolvedValue(mockValidationResponse);

    const result = await validateCSV(formData);

    expect(result.ok).toBe(false);
    expect(result.body).toBe(null);
    expect(result.validBody).toBe(null);
    expect(result.report?.errorRows).toBe(1);
    expect(result.error).toBe(
      'CSV validation failed. Fix errors and re-validate.'
    );
  });

  it('should preserve all response fields from validateCsvBlob', async () => {
    const mockCsvContent =
      'Table Number,Project Title,Track #1\n1,Test,Track A';
    const file = new File([mockCsvContent], 'test.csv', { type: 'text/csv' });
    const formData = new FormData();
    formData.append('file', file);

    const mockTeams: ParsedRecord[] = [
      {
        name: 'Test',
        teamNumber: 1,
        tableNumber: 1,
        tracks: ['Track A'],
        active: true,
      },
    ];

    const mockValidationResponse = {
      ok: true,
      body: mockTeams,
      validBody: mockTeams,
      report: {
        totalTeamsParsed: 1,
        validTeams: 1,
        errorRows: 0,
        warningRows: 0,
        unknownTracks: [],
        issues: [],
      },
      error: null,
    };

    mockValidateCsvBlob.mockResolvedValue(mockValidationResponse);

    const result = await validateCSV(formData);

    expect(result.ok).toBe(mockValidationResponse.ok);
    expect(result.body).toEqual(mockValidationResponse.body);
    expect(result.validBody).toEqual(mockValidationResponse.validBody);
    expect(result.report).toEqual(mockValidationResponse.report);
    expect(result.error).toBe(mockValidationResponse.error);
  });

  it('should handle files with different MIME types', async () => {
    const mockCsvContent = 'Table Number,Project Title\n1,Test';
    const file = new File([mockCsvContent], 'test.txt', {
      type: 'text/plain',
    });
    const formData = new FormData();
    formData.append('file', file);

    const mockTeams: ParsedRecord[] = [
      {
        name: 'Test',
        teamNumber: 1,
        tableNumber: 1,
        tracks: ['Track A'],
        active: true,
      },
    ];

    const mockValidationResponse = {
      ok: true,
      body: mockTeams,
      validBody: mockTeams,
      report: {
        totalTeamsParsed: 1,
        validTeams: 1,
        errorRows: 0,
        warningRows: 0,
        unknownTracks: [],
        issues: [],
      },
      error: null,
    };

    mockValidateCsvBlob.mockResolvedValue(mockValidationResponse);

    const result = await validateCSV(formData);

    expect(mockValidateCsvBlob).toHaveBeenCalledWith(expect.any(Blob));
    expect(result).toEqual(mockValidationResponse);
  });

  it('should handle partial validation with both valid and invalid teams', async () => {
    const mockCsvContent =
      'Table Number,Project Title,Track #1\n1,Valid Team,Track A\n,Invalid Team,Track B';
    const file = new File([mockCsvContent], 'mixed.csv', { type: 'text/csv' });
    const formData = new FormData();
    formData.append('file', file);

    const mockAllTeams: ParsedRecord[] = [
      {
        name: 'Valid Team',
        teamNumber: 1,
        tableNumber: 1,
        tracks: ['Track A'],
        active: true,
      },
      {
        name: 'Invalid Team',
        teamNumber: NaN,
        tableNumber: 2,
        tracks: ['Track B'],
        active: true,
      },
    ];

    const mockValidTeams: ParsedRecord[] = [
      {
        name: 'Valid Team',
        teamNumber: 1,
        tableNumber: 1,
        tracks: ['Track A'],
        active: true,
      },
    ];

    const mockValidationResponse = {
      ok: false,
      body: mockAllTeams,
      validBody: mockValidTeams,
      report: {
        totalTeamsParsed: 2,
        validTeams: 1,
        errorRows: 1,
        warningRows: 0,
        unknownTracks: [],
        issues: [
          {
            rowIndex: 2,
            teamNumberRaw: '',
            severity: 'error' as const,
            invalidTracks: [],
            excludedTracks: [],
            duplicateTracks: [],
            autoFixedTracks: [],
            missingFields: ['Table Number'],
            contactEmails: [],
            contactNames: [],
            memberEmails: [],
            memberNames: [],
            memberColumnsFromTeamMember1: [],
          },
        ],
      },
      error: 'CSV validation failed. Fix errors and re-validate.',
    };

    mockValidateCsvBlob.mockResolvedValue(mockValidationResponse);

    const result = await validateCSV(formData);

    expect(result.ok).toBe(false);
    expect(result.body).toEqual(mockAllTeams);
    expect(result.validBody).toEqual(mockValidTeams);
    expect(result.report?.validTeams).toBe(1);
    expect(result.report?.errorRows).toBe(1);
  });
});
