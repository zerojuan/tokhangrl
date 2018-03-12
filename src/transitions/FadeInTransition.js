import React from "react";
import Transition from "react-transition-group/Transition";

const duration = 300;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
    height: "100vh",
    position: "absolute",
    visibility: "hidden"
};

const transitionStyles = {
    entering: { opacity: 0, visibility: "visible" },
    entered: { opacity: 1, visibility: "visible" }
};

const FadeInTransiiton = ({ children, in: inProps }) => (
    <Transition in={inProps} timeout={duration}>
        {state => (
            <div
                style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}
            >
                {children}
            </div>
        )}
    </Transition>
);

export default FadeInTransiiton;
