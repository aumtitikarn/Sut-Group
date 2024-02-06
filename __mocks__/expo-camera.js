// __mocks__/expo-camera.js
export const Camera = {
    Constants: {
      Type: {
        back: 'back',
        front: 'front',
      },
    },
    takePictureAsync: jest.fn(() => Promise.resolve({ uri: 'some-image-uri' })),
    // Add other methods or properties as needed for your tests
  };
  