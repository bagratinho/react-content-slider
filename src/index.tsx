import * as React from "react";
import styled from "styled-components";
import Measurer from "./Measurer";
import { CSSTransition } from "react-transition-group";

export interface IContentSliderProps {
  currentSlideIndex: number;
  children: any[];
  width?: number;
  transitionDuration: number;
}

export interface IContentSliderState {
  currentSlideIndex: number;
  previousSlideIndex: number;
  height?: number;
  isSliding: boolean;
}

export interface IBounds {
  height?: number;
}

export default class ContentSlider extends React.PureComponent<IContentSliderProps, IContentSliderState> {
  public static getDerivedStateFromProps(props: IContentSliderProps, state: IContentSliderState) {
    if (props.currentSlideIndex !== state.currentSlideIndex) {
      const currentSlideIndex =
        props.currentSlideIndex > props.children.length - 1 ?
          props.children.length - 1 :
            props.currentSlideIndex < 0 ?
              0 :
              props.currentSlideIndex;
      return {
        currentSlideIndex,
        previousSlideIndex: state.currentSlideIndex,
        isSliding: true,
      };
    }
    return null;
  }

  constructor(props: IContentSliderProps) {
    super(props);
    this.state = {
      currentSlideIndex: props.currentSlideIndex,
      previousSlideIndex: props.currentSlideIndex - 1,
      isSliding: false,
    };
  }

  public render() {
    const { width, transitionDuration } = this.props;
    const { isSliding, height } = this.state;
    const className = isSliding ? "sliding" : undefined;
    return (
      <>
        <StyledContainer
          className={className}
          width={width}
          transitionDuration={transitionDuration}
          style={{height}}
        >
          {this.renderSlides()}
        </StyledContainer>
      </>
    );
  }

  private renderSlides() {
    return React.Children.map(this.props.children, (item: any, index: number) => {
      const { currentSlideIndex, previousSlideIndex } = this.state;
      const className =
        index > currentSlideIndex ?
          "slide-right-to-left" :
            index < currentSlideIndex ?
              "slide-left-to-right" :
              index > previousSlideIndex ?
                "slide-right-to-left" :
                "slide-left-to-right";
      return (
        <CSSTransition
          key={`slide-${index}`}
          in={this.state.currentSlideIndex === index}
          mountOnEnter={true}
          unmountOnExit={true}
          classNames={className}
          timeout={this.props.transitionDuration}
          onEntered={this.state.currentSlideIndex === index ? this.slideFinishHandler : undefined}
        >
          <Measurer
            onMeasure={this.setCurrentSlideBounds}
            className="slide"
          >
            {item}
          </Measurer>
        </CSSTransition>
      );
    });
  }

  private setCurrentSlideBounds = (bounds: IBounds) => {
    this.setState({
      height: bounds.height,
    });
  }

  private slideFinishHandler = () => {
    this.setState({
      isSliding: false,
    });
  }
}

export const Slide = (props: { render: () => any }) => {
  return (
    <>
      {props.render()}
    </>
  );
};

const StyledContainer = styled.div<{width?: number, transitionDuration: number}>`
  position: relative;
  width: ${props => props.width ? `${props.width}px` : "auto"};
  transition: height ${props => props.transitionDuration / 2}ms ease;
  transition-delay: ${props => props.transitionDuration / 2}ms;
  &.sliding {
    overflow: hidden;
  }
  & .slide {
    transition: all ${props => props.transitionDuration / 2}ms ease;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    &.slide-right-to-left-enter {
      transform: translateX(50px);
      opacity: 0;
      transition-delay: ${props => props.transitionDuration / 2}ms;
    }
    &.slide-right-to-left-enter-active {
      transform: translateX(0);
      opacity: 1;
      transition-delay: ${props => props.transitionDuration / 2}ms;
    }
    &.slide-right-to-left-enter-done {
      transform: translateX(0);
      opacity: 1;
      transition-delay: ${props => props.transitionDuration / 2}ms;
    }
    &.slide-right-to-left-exit {
      transform: translateX(0);
      opacity: 1;
    }
    &.slide-right-to-left-exit-active {
      transform: translateX(50px);
      opacity: 0;
    }
    &.slide-right-to-left-exit-done {
      transform: translateX(50px);
      opacity: 0;
    }
    &.slide-left-to-right-enter {
      transform: translateX(-50px);
      opacity: 0;
      transition-delay: ${props => props.transitionDuration / 2}ms;
    }
    &.slide-left-to-right-enter-active {
      transform: translateX(0);
      opacity: 1;
      transition-delay: ${props => props.transitionDuration / 2}ms;
    }
    &.slide-left-to-right-enter-done {
      transform: translateX(0);
      opacity: 1;
      transition-delay: ${props => props.transitionDuration / 2}ms;
    }
    &.slide-left-to-right-exit {
      transform: translateX(0);
      opacity: 1;
    }
    &.slide-left-to-right-exit-active {
      transform: translateX(-50px);
      opacity: 0;
    }
    &.slide-left-to-right-exit-done {
      transform: translateX(-50px);
      opacity: 0;
    }
  }
`;
