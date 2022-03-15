import { jest } from "@jest/globals";
import { Readable, Writable } from 'stream';

export default class TestUtil {
	static generateReadableStream(data) {
		return new Readable({
			read() {
				for (const item of data) {
					this.push(item);
				}

				this.push(null);
			}
		})
	}

	static generateWritableStream(data) {
		return new Writable({
			write(chunk, enc, cb) {
				cb(null, chunk);
			}
		})
	}

	static defaulHandleParams() {
		const requestStream = TestUtil.generateReadableStream(['body da req']);
		const response = TestUtil.generateWritableStream(() => { });


		const data = {
			request: Object.assign(requestStream, {
				headers: {},
				method: '',
				url: ''
			}),
			response: Object.assign(response, {
				writeHead: jest.fn(),
				end: jest.fn()
			})
		}
	}
}