import { render, screen, fireEvent } from '@testing-library/react';
import Table from './Table';

describe('Table', () => {
    const columns = [
        { key: 'id', title: 'ID', className: 'bg-gray-500' },
        { key: 'name', title: 'Name', className: 'bg-gray-500' },
    ];

    const data = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
    ];

    const renderRow = (item) => (
        <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
        </tr>
    );

    const onSortChange = jest.fn();

    const sortIndicator = (key) => <span>{key === 'id' ? '🔽' : '🔼'}</span>;

    it('renders table with data and headers', () => {
        render(<Table columns={columns} data={data} renderRow={renderRow} />);

        expect(screen.getByText('ID')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('calls onSortChange when a sortable column header is clicked', () => {
        render(
            <Table
                columns={columns}
                data={data}
                renderRow={renderRow}
                onSortChange={onSortChange}
                sortIndicator={sortIndicator}
            />
        );

        const idHeader = screen.getByText('ID');
        fireEvent.click(idHeader);
        expect(onSortChange).toHaveBeenCalledWith('id');
    });

    it('displays sort indicators correctly', () => {
        render(
            <Table
                columns={columns}
                data={data}
                renderRow={renderRow}
                onSortChange={onSortChange}
                sortIndicator={sortIndicator}
            />
        );

        expect(screen.getByText('🔽')).toBeInTheDocument(); // Sort indicator for 'id'
        expect(screen.getByText('🔼')).toBeInTheDocument(); // Sort indicator for 'name'
    });
});
