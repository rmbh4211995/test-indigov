/**
 * A "ticket" is a request made by a constituent to Indigov. It has info about what the message is, who made it,
 * and the status of the request.
 * Given an API call at GET https://indigov.com/tickets that returns data like this {id: string; name: string,
 * message: string; status: 'new' | 'open' | 'complete'}[], write a single
 * React component that shows a loading message, fetches the data, and displays it as a list,
 * 100 tickets per page (could be hundreds of tickets returned from the API call).
 * The final result should be just 1 file. Any questions, feel free to reach out to me. I'm available afternoons this week.
 */
// const testData = [
//     {
//         id: "1",
//         name: "Sara",
//         message: "Fix toilet",
//         status: "new"
//     },
//     {
//         id: "2",
//         name: "Mike",
//         message: "Read new books",
//         status: "open"
//     },
//     {
//         id: "3",
//         name: "Tret",
//         message: "Cook dinner",
//         status: "complete"
//     },
// ];
import React, { useState, useEffect } from "react";

const increment = 100;

const Ticket = ({ name, message, status }) => {
    return (
        <div className={"ticket"}>
            <p className={"msg"}>{message}</p>
            <span className={"created-by"}>Created by</span>
            <span className={"name"}> {name}</span>
            <span className={"status"}>{`${status.charAt(0).toUpperCase()}${status.substring(1, status.length)}`}</span>
        </div>
    )
};

const Loader = ({ message }) => <div className={"loader"}>{message}</div>;

const PaginatedList = () => {
    // const [tickets, setTickets] = useState(testData);
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [range, setRange] = useState([0, increment]);

    useEffect(() => {
        fetch('https://indigov.com/tickets')
            .then(res => res.json())
            .then(json => {
                setTickets(json);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    const onPaginatePrev = () => {
        setRange(prevRange => {
            const low = Math.max(0, prevRange[0] - increment);
            const high = prevRange[1] - increment;
            return [low, high];
        });
    };

    const onPaginateNext = () => {
        setRange(prevRange => {
            const low = Math.max(0, prevRange[0] + increment);
            const high = prevRange[1] + increment;
            return [low, high];
        });
    };

    if (isLoading) {
        return <Loader message={"Fetching your data.."} />;
    }

    return (
        <div className={"paginated-list-cnt"}>
            <div className={"paginated-count"}>
                <span>Tickets </span>
                <span style={{ color: 'rgb(62, 100, 255)' }}>{tickets.length}</span>
            </div>
            <div className={"paginated-list"}>
                {tickets.slice(range[0], range[1]).map(t => {
                    return <Ticket key={t.id} {...t} />;
                })}
            </div>
            <div className={"paginated-btn-cnt"}>
                <button onClick={onPaginatePrev} disabled={range[0] - increment < 0}>
                    Prev
                </button>
                <button onClick={onPaginateNext} disabled={range[0] + increment > tickets.length}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default PaginatedList;