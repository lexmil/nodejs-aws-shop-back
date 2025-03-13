import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../index';

// Mock S3 with a proper class structure
const mockGetSignedUrlPromise = jest.fn();
const mockS3Instance = {
	getSignedUrlPromise: mockGetSignedUrlPromise
};

jest.mock('aws-sdk', () => ({
	S3: jest.fn(() => mockS3Instance)
}));

describe('importProductsFile Lambda', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		process.env.BUCKET_NAME = 'XXXXXXXXXXX';
	});

	it('should generate signed URL for valid CSV file', async () => {
		// Arrange
		const mockSignedUrl = 'https://XXXXXXXXXXXXXXXXXXXXXXXXXXXX/uploaded/test.csv';
		mockGetSignedUrlPromise.mockResolvedValueOnce(mockSignedUrl);

		const event: APIGatewayProxyEvent = {
			queryStringParameters: {
				name: 'test.csv'
			}
		} as any;

		// Act
		const response = await handler(event);

		// Assert
		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.body)).toBe(mockSignedUrl);
		expect(mockGetSignedUrlPromise).toHaveBeenCalledWith('putObject', {
			Bucket: 'XXXXXXXXXXX',
			Key: 'uploaded/test.csv',
			ContentType: 'text/csv',
			Expires: 60
		});
		expect(response.headers).toEqual({
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		});
	});

	it('should return 400 when filename is missing', async () => {
		// Arrange
		const event: APIGatewayProxyEvent = {
			queryStringParameters: null
		} as any;

		// Act
		const response = await handler(event);

		// Assert
		expect(response.statusCode).toBe(400);
		expect(JSON.parse(response.body)).toEqual({
			message: 'File name is required'
		});
		expect(mockGetSignedUrlPromise).not.toHaveBeenCalled();
	});

	it('should return 400 when filename is empty', async () => {
		// Arrange
		const event: APIGatewayProxyEvent = {
			queryStringParameters: {
				name: ''
			}
		} as any;

		// Act
		const response = await handler(event);

		// Assert
		expect(response.statusCode).toBe(400);
		expect(JSON.parse(response.body)).toEqual({
			message: 'File name is required'
		});
		expect(mockGetSignedUrlPromise).not.toHaveBeenCalled();
	});

	it('should return 400 when file is not a CSV', async () => {
		// Arrange
		const event: APIGatewayProxyEvent = {
			queryStringParameters: {
				name: 'test.txt'
			}
		} as any;

		// Act
		const response = await handler(event);

		// Assert
		expect(response.statusCode).toBe(400);
		expect(JSON.parse(response.body)).toEqual({
			message: 'Only .csv files are allowed'
		});
		expect(mockGetSignedUrlPromise).not.toHaveBeenCalled();
	});

	it('should return 500 when S3 service fails', async () => {
		// Arrange
		mockGetSignedUrlPromise.mockRejectedValueOnce(new Error('S3 Error'));

		const event: APIGatewayProxyEvent = {
			queryStringParameters: {
				name: 'test.csv'
			}
		} as any;

		// Act
		const response = await handler(event);

		// Assert
		expect(response.statusCode).toBe(500);
		expect(JSON.parse(response.body)).toEqual({
			message: 'Internal Server Error'
		});
	});

	it('should handle filenames with spaces', async () => {
		// Arrange
		const mockSignedUrl = 'https://XXXXXXXXXXXXXXXXXXXXXXXXXXXX/uploaded/test%20file.csv';
		mockGetSignedUrlPromise.mockResolvedValueOnce(mockSignedUrl);

		const event: APIGatewayProxyEvent = {
			queryStringParameters: {
				name: 'test file.csv'
			}
		} as any;

		// Act
		const response = await handler(event);

		// Assert
		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.body)).toBe(mockSignedUrl);
		expect(mockGetSignedUrlPromise).toHaveBeenCalledWith('putObject', {
			Bucket: 'XXXXXXXXXXX',
			Key: 'uploaded/test file.csv',
			ContentType: 'text/csv',
			Expires: 60
		});
	});

	it('should handle filenames with special characters', async () => {
		// Arrange
		const mockSignedUrl = 'https://XXXXXXXXXXXXXXXXXXXXXXXXXXXX/uploaded/test-file_%40.csv';
		mockGetSignedUrlPromise.mockResolvedValueOnce(mockSignedUrl);

		const event: APIGatewayProxyEvent = {
			queryStringParameters: {
				name: 'test-file_@.csv'
			}
		} as any;

		// Act
		const response = await handler(event);

		// Assert
		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.body)).toBe(mockSignedUrl);
		expect(mockGetSignedUrlPromise).toHaveBeenCalledWith('putObject', {
			Bucket: 'XXXXXXXXXXX',
			Key: 'uploaded/test-file_@.csv',
			ContentType: 'text/csv',
			Expires: 60
		});
	});
});
