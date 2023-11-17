import { useCallback } from "react";

export const useHttp = () => {
    // const [process, setProcess] = useState('waiting');

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}, mode = 'no-cors') => {

        // setProcess('loading');

        console.log('________________')

        try {
            const response = await fetch(url, {method, body, headers, mode});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            const data = await response.json();

            console.log(data)

            return data;
        } catch(e) {
            // setProcess('error');
            console.log(e)
            throw e;
        }
    }, []);

    // const clearError = useCallback(() => {
        // setProcess('loading');
    // }, []);

    return {request, 
            // clearError, 
            // process, 
            // setProcess
        }
}