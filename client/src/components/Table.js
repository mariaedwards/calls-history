import classNames from 'classnames';

const Table = ({ columns, data, renderRow }) => {
    return (
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    className={classNames(
                                        'sticky px-3 py-3.5 text-left uppercase text-xs font-semibold text-white',
                                        column.className
                                    )}>
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {data.map((item) => renderRow(item))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
