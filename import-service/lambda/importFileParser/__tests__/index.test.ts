import { S3Event } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from 'stream';
import { handler } from '../index';

// Mock the AWS SDK v3 S3 Client
jest.mock('@aws-sdk/client-s3', () => ({
	S3Client: jest.fn(() => ({
		send: jest.fn()
	})),
	GetObjectCommand: jest.fn()
}));

// Mock the AWS SDK v2 S3
const mockCopyObject = jest.fn().mockReturnValue({ promise: () => Promise.resolve() });
const mockDeleteObject = jest.fn().mockReturnValue({ promise: () => Promise.resolve() });

jest.mock('aws-sdk', () => ({
	S3: jest.fn(() => ({
		copyObject: mockCopyObject,
		deleteObject: mockDeleteObject
	}))
}));

describe('importFileParser Lambda', () => {
	let mockS3Send: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		mockS3Send = (S3Client as jest.Mock).mock.results[0].value.send;
	});

	it('should process CSV file and move it to parsed directory', async () => {
		// Create a mock readable stream
		const mockReadable = new Readable({
			read() {
				this.push('header1,header2\n');
				this.push('value1,value2\n');
				this.push(null);
			}
		});

		// Mock the S3 getObject response
		mockS3Send.mockResolvedValueOnce({
			Body: mockReadable
		});

		const s3Event: S3Event = {
			Records: [{
				eventVersion: '2.0',
				eventSource: 'aws:s3',
				awsRegion: 'us-east-1',
				eventTime: '1970-01-01T00:00:00.000Z',
				eventName: 'ObjectCreated:Put',
				userIdentity: {
					principalId: 'EXAMPLE'
				},
				requestParameters: {
					sourceIPAddress: '127.0.0.1'
				},
				responseElements: {
					'x-amz-request-id': 'EXAMPLE123456789',
					'x-amz-id-2': 'EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH'
				},
				s3: {
					s3SchemaVersion: '1.0',
					configurationId: 'testConfigRule',
					bucket: {
						name: 'test-bucket',
						ownerIdentity: {
							principalId: 'EXAMPLE'
						},
						arn: 'arn:aws:s3:::test-bucket'
					},
					object: {
						key: 'uploaded/test.csv',
						size: 1024,
						eTag: '0123456789abcdef0123456789abcdef',
						sequencer: '0A1B2C3D4E5F678901'
					}
				}
			}]
		};

		await handler(s3Event);

		// Verify file was copied to parsed directory
		expect(mockCopyObject).toHaveBeenCalledWith({
			Bucket: 'XXXXXXXXXXX',
			CopySource: 'test-bucket/uploaded/test.csv',
			Key: 'parsed/test.csv'
		});

		// Verify original file was deleted from uploaded directory
		expect(mockDeleteObject).toHaveBeenCalledWith({
			Bucket: 'test-bucket',
			Key: 'uploaded/test.csv'
		});
	});

	it('should handle errors during file processing', async () => {
		mockS3Send.mockRejectedValueOnce(new Error('Failed to get object'));

		const s3Event: S3Event = {
			Records: [{
				s3: {
					bucket: {
						name: 'test-bucket'
					},
					object: {
						key: 'uploaded/test.csv'
					}
				}
			}] as any
		};

		await expect(handler(s3Event)).rejects.toThrow('Failed to get object');
		expect(mockCopyObject).not.toHaveBeenCalled();
		expect(mockDeleteObject).not.toHaveBeenCalled();
	});

	it('should not process files not in uploaded directory', async () => {
		const s3Event: S3Event = {
			Records: [{
				s3: {
					bucket: {
						name: 'test-bucket'
					},
					object: {
						key: 'wrong-directory/test.csv'
					}
				}
			}] as any
		};

		await expect(handler(s3Event)).rejects.toThrow('File is not in the uploaded directory');
		expect(mockCopyObject).not.toHaveBeenCalled();
		expect(mockDeleteObject).not.toHaveBeenCalled();
	});
});
