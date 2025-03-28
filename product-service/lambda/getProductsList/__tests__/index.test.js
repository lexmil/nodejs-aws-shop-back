"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const products_1 = __importDefault(require("../../../mock/products"));
describe("getProductsList Lambda", () => {
    let mockEvent;
    beforeEach(() => {
        mockEvent = {
            httpMethod: "GET",
            path: "/products",
            headers: {},
            queryStringParameters: null,
            pathParameters: null,
            body: null,
            isBase64Encoded: false,
            requestContext: {},
            multiValueHeaders: {},
            multiValueQueryStringParameters: null,
            stageVariables: null,
            resource: "",
        };
    });
    it("should return all products with status 200", async () => {
        const response = await (0, index_1.handler)(mockEvent);
        expect(response.statusCode).toBe(200);
        expect(response.headers).toEqual({
            "Content-Type": "application/json",
        });
        expect(JSON.parse(response.body)).toEqual(products_1.default);
    });
    it("should handle errors and return 500", async () => {
        // Mock products import to simulate error
        jest.mock("../../../mock/products", () => {
            throw new Error("Failed to load products");
        });
        const response = await (0, index_1.handler)(mockEvent);
        expect(response.statusCode).toBe(500);
        expect(response.headers).toEqual({
            "Content-Type": "application/json",
        });
        expect(JSON.parse(response.body)).toEqual({
            message: "Internal server error",
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxvQ0FBbUM7QUFDbkMsc0VBQThDO0FBRTlDLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7SUFDdEMsSUFBSSxTQUErQixDQUFDO0lBRXBDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxTQUFTLEdBQUc7WUFDVixVQUFVLEVBQUUsS0FBSztZQUNqQixJQUFJLEVBQUUsV0FBVztZQUNqQixPQUFPLEVBQUUsRUFBRTtZQUNYLHFCQUFxQixFQUFFLElBQUk7WUFDM0IsY0FBYyxFQUFFLElBQUk7WUFDcEIsSUFBSSxFQUFFLElBQUk7WUFDVixlQUFlLEVBQUUsS0FBSztZQUN0QixjQUFjLEVBQUUsRUFBUztZQUN6QixpQkFBaUIsRUFBRSxFQUFFO1lBQ3JCLCtCQUErQixFQUFFLElBQUk7WUFDckMsY0FBYyxFQUFFLElBQUk7WUFDcEIsUUFBUSxFQUFFLEVBQUU7U0FDYixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDMUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLGVBQU8sRUFBQyxTQUFTLENBQUMsQ0FBQztRQUUxQyxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUMvQixjQUFjLEVBQUUsa0JBQWtCO1NBQ25DLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBUSxDQUFDLENBQUM7SUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbkQseUNBQXlDO1FBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1lBQ3ZDLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSxlQUFPLEVBQUMsU0FBUyxDQUFDLENBQUM7UUFFMUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDL0IsY0FBYyxFQUFFLGtCQUFrQjtTQUNuQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDeEMsT0FBTyxFQUFFLHVCQUF1QjtTQUNqQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQVBJR2F0ZXdheVByb3h5RXZlbnQgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuaW1wb3J0IHsgaGFuZGxlciB9IGZyb20gXCIuLi9pbmRleFwiO1xuaW1wb3J0IHByb2R1Y3RzIGZyb20gXCIuLi8uLi8uLi9tb2NrL3Byb2R1Y3RzXCI7XG5cbmRlc2NyaWJlKFwiZ2V0UHJvZHVjdHNMaXN0IExhbWJkYVwiLCAoKSA9PiB7XG4gIGxldCBtb2NrRXZlbnQ6IEFQSUdhdGV3YXlQcm94eUV2ZW50O1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIG1vY2tFdmVudCA9IHtcbiAgICAgIGh0dHBNZXRob2Q6IFwiR0VUXCIsXG4gICAgICBwYXRoOiBcIi9wcm9kdWN0c1wiLFxuICAgICAgaGVhZGVyczoge30sXG4gICAgICBxdWVyeVN0cmluZ1BhcmFtZXRlcnM6IG51bGwsXG4gICAgICBwYXRoUGFyYW1ldGVyczogbnVsbCxcbiAgICAgIGJvZHk6IG51bGwsXG4gICAgICBpc0Jhc2U2NEVuY29kZWQ6IGZhbHNlLFxuICAgICAgcmVxdWVzdENvbnRleHQ6IHt9IGFzIGFueSxcbiAgICAgIG11bHRpVmFsdWVIZWFkZXJzOiB7fSxcbiAgICAgIG11bHRpVmFsdWVRdWVyeVN0cmluZ1BhcmFtZXRlcnM6IG51bGwsXG4gICAgICBzdGFnZVZhcmlhYmxlczogbnVsbCxcbiAgICAgIHJlc291cmNlOiBcIlwiLFxuICAgIH07XG4gIH0pO1xuXG4gIGl0KFwic2hvdWxkIHJldHVybiBhbGwgcHJvZHVjdHMgd2l0aCBzdGF0dXMgMjAwXCIsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGhhbmRsZXIobW9ja0V2ZW50KTtcblxuICAgIGV4cGVjdChyZXNwb25zZS5zdGF0dXNDb2RlKS50b0JlKDIwMCk7XG4gICAgZXhwZWN0KHJlc3BvbnNlLmhlYWRlcnMpLnRvRXF1YWwoe1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgfSk7XG4gICAgZXhwZWN0KEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSkpLnRvRXF1YWwocHJvZHVjdHMpO1xuICB9KTtcblxuICBpdChcInNob3VsZCBoYW5kbGUgZXJyb3JzIGFuZCByZXR1cm4gNTAwXCIsIGFzeW5jICgpID0+IHtcbiAgICAvLyBNb2NrIHByb2R1Y3RzIGltcG9ydCB0byBzaW11bGF0ZSBlcnJvclxuICAgIGplc3QubW9jayhcIi4uLy4uLy4uL21vY2svcHJvZHVjdHNcIiwgKCkgPT4ge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGxvYWQgcHJvZHVjdHNcIik7XG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGhhbmRsZXIobW9ja0V2ZW50KTtcblxuICAgIGV4cGVjdChyZXNwb25zZS5zdGF0dXNDb2RlKS50b0JlKDUwMCk7XG4gICAgZXhwZWN0KHJlc3BvbnNlLmhlYWRlcnMpLnRvRXF1YWwoe1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgfSk7XG4gICAgZXhwZWN0KEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSkpLnRvRXF1YWwoe1xuICAgICAgbWVzc2FnZTogXCJJbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIixcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==