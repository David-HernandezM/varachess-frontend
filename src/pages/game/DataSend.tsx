import { useState, useEffect } from 'react';
import React from 'react'




 function DataSend()  {
    interface FetchData {
        url: string;
        options?: RequestInit;
    }

    const [datadis, setDatadis] = useState<any>(null);
    const [datadis2, setDatadis2] = useState<any>(null);

    const POST_API =
        "https://jsonplaceholder.typicode.com/posts";
    const ERROR_MSG = "Oops! Something went wrong 🤷‍♂️";

    const MILLISECONDS_A_DAY = 1000 * 60 * 60 * 24; // number of milliseconds in a day

    // fetch resources from given URL and returns a serialized json response
    const fetchData = async function ({ url, options }: FetchData): Promise<any> {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(ERROR_MSG);
        }

        const data = await response.json();
        return data;
    };

    // Process API requests for GETing and POSTing data

    const someObj = {
        title: 'foo',
        body: 'bar',
        userId: 12,
    };

    const processApiRequests = async function (anObj: any) {

        const options: RequestInit = {
            method: "POST",
            body: JSON.stringify(anObj),
            headers: {
                Accept: "application/json, text/plain",
                "Content-Type": "application/json;charset=UTF-8"
            }
        };

        // Submit and return a POST Request to the API with options
        return await fetchData({ url: POST_API, options });
    };

    useEffect(() => {
        // Process API requests and data manipulation
        processApiRequests(someObj)
            .then(data => {
                //setIsLoading(false);
                //setState(data);
                console.log("This is the data: ")
                console.log(data);
                setDatadis(JSON.stringify(data));

            })
            .catch(e => console.log(e.message));

    }, []);
   

    return(

        <>
        <p>This is the post data: {datadis} </p>
        </>
    )

}

export default {DataSend};