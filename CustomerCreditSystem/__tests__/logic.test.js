import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, Button, View } from 'react-native';
import { AppProvider, useApp } from '../src/context/AppContext';

// Mocking console.error to avoid noise from expected errors
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Error: Mobile number must be exactly 9 digits/.test(args[0])) {
      return;
    }
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});

const TestComponent = () => {
  const { customers, addCustomer, addPayment, totalCredit } = useApp();

  return (
    <View>
      <Text testID="totalCredit">{totalCredit}</Text>
      <Text testID="customerCount">{customers.length}</Text>
      {customers.map(c => (
        <Text key={c.id} testID={`credit-${c.name}`}>{c.credit}</Text>
      ))}
      <Button
        title="Add User"
        onPress={() => addCustomer('John', '123456789')}
      />
      <Button
        title="Add Invalid User"
        onPress={() => addCustomer('John', '123')}
      />
      <Button
        title="Pay User"
        onPress={() => addPayment(customers[0]?.id, 50)}
      />
    </View>
  );
};

describe('AppContext Logic', () => {
  it('adds customer correctly', () => {
    const { getByTestId, getByText } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(getByTestId('customerCount').props.children).toBe(0);

    fireEvent.press(getByText('Add User'));

    expect(getByTestId('customerCount').props.children).toBe(1);
  });

  it('validates mobile number', () => {
    const { getByText, getByTestId } = render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

    expect(() => fireEvent.press(getByText('Add Invalid User'))).toThrow('Mobile number must be exactly 9 digits.');

    // Ensure state didn't change
    expect(getByTestId('customerCount').props.children).toBe(0);
  });

  it('updates credit and total credit', () => {
    const { getByTestId, getByText } = render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
    );

    fireEvent.press(getByText('Add User'));
    fireEvent.press(getByText('Pay User'));

    // Wait, initial credit 0. Pay 50 -> Credit -50.
    // Total credit should be -50.
    expect(getByTestId('totalCredit').props.children).toBe(-50);
  });
});
