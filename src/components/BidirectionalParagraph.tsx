import React, { ReactNode, HTMLAttributes, ReactElement } from 'react';
import { formatBidirectionalText } from '../utils/textDirection';

interface BidirectionalContainerProps {
  children: ReactNode;
}

const isParagraphElement = (
  element: ReactElement
): element is ReactElement<HTMLAttributes<HTMLParagraphElement>> => {
  return element.type === 'p';
};

const processTextNode = (text: string) => {
  const { formattedText, direction } = formatBidirectionalText(text);
  return (
    <span
      style={{ direction }}
      lang={direction === 'rtl' ? 'ar' : 'en'}
    >
      {formattedText}
    </span>
  );
};

const processChildren = (children: ReactNode): ReactNode => {
  return React.Children.map(children, child => {
    if (typeof child === 'string') {
      return processTextNode(child);
    }

    if (React.isValidElement(child)) {
      // <p> elements
      if (isParagraphElement(child) && typeof child.props.children === 'string') {
        const { formattedText, direction } = formatBidirectionalText(child.props.children);
        return React.cloneElement(child, {
          style: {
            ...(child.props.style || {}),
            direction,
          },
          lang: direction === 'rtl' ? 'ar' : 'en',
          children: formattedText,
        });
      }

      // for childrens of another elements
      if (child.props.children) {
        return React.cloneElement(child, {
          ...child.props,
          children: processChildren(child.props.children),
        });
      }
    }

    return child; // skipping un text elements images and buttons
  });
};

export const BidirectionalContainer = ({ children }: BidirectionalContainerProps) => {
  return <div className="bidirectional-container">{processChildren(children)}</div>;
};
