import React from 'react';
import { render } from '@testing-library/react-native';
import AddMedScreen from '../screens/AddMedScreen';

jest.mock('../services/imageService', () => ({
  pickImage: jest.fn(() => Promise.resolve({ uri: null })),
}));

jest.mock('../services/notificationsService', () => ({
  scheduleNotificationForTime: jest.fn(() => Promise.resolve('notification-id')),
}));

describe('AddMedScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar sin error', () => {
    const component = render(
      <AddMedScreen navigation={mockNavigation} />
    );
    expect(component).toBeTruthy();
  });

  it('debe aceptar props de navegación', () => {
    const component = render(
      <AddMedScreen navigation={mockNavigation} />
    );
    expect(mockNavigation).toBeDefined();
    expect(component).toBeTruthy();
  });

  it('debe renderi con navigator mock', () => {
    const customNav = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    const component = render(
      <AddMedScreen navigation={customNav} />
    );
    expect(component).toBeTruthy();
  });
});
