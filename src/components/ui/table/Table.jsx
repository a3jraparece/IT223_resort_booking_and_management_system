import React, { useEffect, useState } from 'react'
import LoadingTable from "./LoadingTable";

const Table = ({ children, theadings, isLoading = false, containerRef }) => {

    const styles = {
        table: 'min-w-full border-separate border-spacing-0 py-1',
        theading: 'bg-green-600 text-white ',
        th: 'border px-3 py-2 text-sm font-semibold text-left whitespace-nowrap text-nowrap last:rounded-tr-sm first:rounded-tl-sm first:w-12 text-left first:text-center last:text-center last:w-12',
        tbody: '',
        row: '',
        col: '',
    };

    if (!theadings.length > 0) {
        return (
            <div className='p-4 text-red-400'>
                Error!  No table headings
            </div>
        );
    }

    // const [internalLoading, setInternalLoading] = useState(isLoading);

    // useEffect(() => {
    //     if (isLoading) {
    //         const timeout = setTimeout(() => {
    //             setInternalLoading(false);
    //         }, 5000);
    //         return () => clearTimeout(timeout);
    //     }
    // }, [isLoading]);

    if (isLoading) {
        return (
            <LoadingTable row_count={5} col_count={theadings.length} />
        );
    }

    // const [showDiv, setShowDiv] = useState(false);


    // enable ni if mag perform na apil ang div nga e retun nga nakacomment
    // useEffect(() => {
    //     //maka bother kayu ang error ay :>
    //     // console.log(containerRef);
    //     if (!containerRef?.current) return;

    //     const rows = containerRef.current.querySelectorAll('tbody tr');
    //     setShowDiv(rows.length >= 5);
    // }, []);


    // useEffect(() => {
    //     if (!containerRef.current) return;

    //     const height = containerRef.current.clientHeight;

    //     // Example: Show overflow if height exceeds 300px
    //     setShowDiv(height > 300);
    // }, [children]);

    return (
        // showDiv
        // <div className={`${true ? 'overflow-x-auto overflow-y-visible' : ''}`}>
        <table ref={containerRef} className={`${styles.table}`} >
            <thead className={`${styles.theading}`}>
                <tr>
                    {theadings.map((theading, index) => (
                        <th
                            key={index}
                            className={`${styles.th}`}
                        >
                            {theading}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
        // </div>
    )
}

export default Table