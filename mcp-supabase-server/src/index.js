#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const pg_1 = __importDefault(require("pg"));
const { SUPABASE_DB_PASSWORD, SUPABASE_PROJECT_REF, SUPABASE_REGION, } = process.env;
if (!SUPABASE_DB_PASSWORD || !SUPABASE_PROJECT_REF || !SUPABASE_REGION) {
    throw new Error('Missing required Supabase environment variables');
}
const connectionString = `postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.${SUPABASE_PROJECT_REF}.${SUPABASE_REGION}.supabase.co:5432/postgres`;
const pool = new pg_1.default.Pool({
    connectionString,
});
function queryDatabase(sql) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield pool.connect();
        try {
            const res = yield client.query(sql);
            return res;
        }
        finally {
            client.release();
        }
    });
}
const server = new index_js_1.Server({
    name: 'supabase-query-server',
    version: '0.1.0',
}, {
    capabilities: {
        resources: {},
        tools: {},
    },
});
server.setRequestHandler(types_js_1.ListToolsRequestSchema, () => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        tools: [
            {
                name: 'query',
                description: 'Execute a SQL query on the Supabase database',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'SQL query string',
                        },
                    },
                    required: ['query'],
                },
            },
        ],
    });
}));
server.setRequestHandler(types_js_1.CallToolRequestSchema, (request) => __awaiter(void 0, void 0, void 0, function* () {
    if (request.params.name !== 'query') {
        throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
    }
    const { query } = request.params.arguments;
    try {
        const result = yield queryDatabase(query);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result.rows, null, 2),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error executing query: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
}));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const transport = new stdio_js_1.StdioServerTransport();
        yield server.connect(transport);
        console.error('Supabase MCP server running');
    });
}
main().catch(console.error);
