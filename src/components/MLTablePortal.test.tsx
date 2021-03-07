import React from "react";
import generateText from "./MLTablePortal"
import MLTablePortal from "./MLTablePortal";
import { render, screen } from "@testing-library/react";


let mock; // here we make variable in the scope we have tests
jest.mock('./MLTablePortal', () => {
    mock = jest.fn(() => Promise.resolve()); // here we assign it
    return {generateText: mock}; // here we use it in our mocked class
});

test('Leela', () => {
    let text = MLTablePortal.generateText()
    expect(text).toBe("hello Leela");
});