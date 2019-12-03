import { sendApiRequest } from "../services/apiRequest";
import { validateResponse } from "../services/apiTest";
import * as colors from "colors/safe";
import { v4 } from "uuid";

export default async function handleTestAction(cmd: any, env: any) {

    console.log("\nAspecto API Tests results\n");
    try {

        let didFail = false;
        for (let i = 1; i < 6; i++) {
            const responseAsString = await sendApiRequest(i);
            const response = JSON.parse(responseAsString);
            const ok = validateResponse(response);

            if (!ok) {
                didFail = true;
                console.error(colors.red(`http://localhost:3322/item/${i} response.contact should be email by got ${response.contact}\n`) +
                    colors.italic(`For more details https://app.aspecto.io/tests/failed/${v4()}\n\n`))
                if (cmd.allowFail) {

                    process.exit(-1)
                }
                break;
            }
        }


        if (!didFail) {
            console.log(colors.green('All API test passed!'))
        }

    } catch (e) {
        console.error(`Aspecto API tests failed, is your server running and reachable?`)
    }



}