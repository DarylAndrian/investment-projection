// api/backendService.js
/**
 * STUB: Simulates connecting to a PostgreSQL database and saving scenario data.
 * In a real application, this would contain Express/Fastify routes 
 * interacting with an ORM (e.g., Knex or Prisma).
 */

const DATABASE = {
    scenarios: [] // Mock DB array
};

/**
 * Saves the current financial scenario to the database.
 * @param {Object} data - The calculated scenario data.
 * @returns {Promise<String>} Success message or ID.
 */
export async function saveScenario(data) {
    console.log('--- API CALL: Attempting to save scenario ---');

    if (!data || !data.inputs || !data.results) {
        throw new Error("Invalid data provided for saving.");
    }

    const newScenario = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        userInputs: data.inputs,
        results: data.results
    };

    DATABASE.scenarios.push(newScenario);
    console.log(`Successfully mocked save for scenario ID: ${newScenario.id}`);
    
    return `Success! Scenario saved with ID: ${newScenario.id}. Check local database mock.`;
}

// Export helper functions if needed (e.g., fetchScenarioById, deleteScenario)
export function getMockDatabase() {
    return DATABASE;
}