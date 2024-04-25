import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DateFilterBar from './DateFilterBar';
import * as validator from '@/utils/validators';

// Mocking the validateDate utility
jest.mock('@/utils/validators', () => ({
  validateDate: jest.fn(),
}));

// Helper function to setup test environment
const setup = () => {
  validator.validateDate.mockImplementation((date) => {
    if (date === '' || date === null) return true;
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    return dateRegex.test(date);
  });
  const handleFilter = jest.fn();
  render(<DateFilterBar onFilter={handleFilter} />);
  const startDateInput = screen.getByTestId('start-date');
  const endDateInput = screen.getByTestId('end-date');
  return { startDateInput, endDateInput, handleFilter };
};

describe('DateFilterBar Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders component and shows initial empty input fields', () => {
    const { startDateInput, endDateInput } = setup();
    expect(startDateInput.value).toBe('');
    expect(endDateInput.value).toBe('');
  });

  it('allows user to enter start and end dates', () => {
    const { startDateInput, endDateInput } = setup();
    fireEvent.change(startDateInput, { target: { value: '01-01-2023' } });
    fireEvent.change(endDateInput, { target: { value: '01-02-2023' } });
    expect(startDateInput.value).toBe('01-01-2023');
    expect(endDateInput.value).toBe('01-02-2023');
  });

  it('displays error when start or end date is invalid', () => {
    const { startDateInput, endDateInput } = setup();
    fireEvent.change(startDateInput, { target: { value: 'start-invalid' } });
    fireEvent.change(endDateInput, { target: { value: 'end-invalid' } });
    fireEvent.click(screen.getByText('Filter'));
    expect(screen.getByText('Invalid start date.')).toBeInTheDocument();
    expect(screen.getByText('Invalid end date.')).toBeInTheDocument();
  });

  it('clears inputs and errors when clear button is clicked', () => {
    const { startDateInput, endDateInput } = setup();
    fireEvent.change(startDateInput, { target: { value: 'start-invalid' } });
    fireEvent.change(endDateInput, { target: { value: 'end-invalid' } });
    fireEvent.click(screen.getByText('Clear'));
    expect(startDateInput.value).toBe('');
    expect(endDateInput.value).toBe('');
    expect(screen.queryByText('Invalid start date.')).toBeNull();
    expect(screen.queryByText('Invalid end date.')).toBeNull();
  });

  it('calls onFilter with correct dates when both dates are valid', () => {
    const { startDateInput, endDateInput, handleFilter } = setup();
    fireEvent.change(startDateInput, { target: { value: '01-01-2023' } });
    fireEvent.change(endDateInput, { target: { value: '01-02-2023' } });
    fireEvent.click(screen.getByText('Filter'));
    expect(handleFilter).toHaveBeenCalledWith('01-01-2023', '01-02-2023');
  });

  it('does not call onFilter when either date is invalid', () => {
    const { startDateInput, endDateInput, handleFilter } = setup();
    fireEvent.change(startDateInput, { target: { value: '01-01-2023' } });
    fireEvent.change(endDateInput, { target: { value: 'end-invalid' } });
    fireEvent.click(screen.getByText('Filter'));
    expect(handleFilter).not.toHaveBeenCalled();
  });
});
