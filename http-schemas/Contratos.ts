import { z } from "zod";

export const ContratosSchema = z.array(
	z.object({
		// Basic contract fields - can be expanded based on actual API response
		ID: z.string().optional(),
		NUMERO: z.string().optional(),
		OBJETO: z.string().optional(),
		VALOR: z.string().optional(),
		FORNECEDOR: z.string().optional(),
		DATA: z.string().optional(),
		STATUS: z.string().optional(),
		// Add more fields as needed based on actual API response
	}),
);

export type ContratosSchemaType = z.infer<typeof ContratosSchema>;
