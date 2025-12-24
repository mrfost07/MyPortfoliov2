"use client";
import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
    <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
    x: i * distX,
    y: -i * distY,
    z: -i * distX * 1.5,
    zIndex: total - i
});

const placeNow = (el, slot, skew) =>
    gsap.set(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        xPercent: -50,
        yPercent: -50,
        skewY: skew,
        transformOrigin: 'center center',
        zIndex: slot.zIndex,
        force3D: true
    });

const CardSwap = ({
    width = 500,
    height = 400,
    cardDistance = 60,
    verticalDistance = 70,
    delay = 5000,
    pauseOnHover = false,
    onCardClick,
    skewAmount = 6,
    easing = 'elastic',
    children
}) => {
    // Speed multiplier - lower = faster
    const speedMultiplier = 0.5;

    const config =
        easing === 'elastic'
            ? {
                ease: 'elastic.out(0.6,0.9)',
                durDrop: 1 * speedMultiplier,
                durMove: 1 * speedMultiplier,
                durReturn: 1 * speedMultiplier,
                promoteOverlap: 0.9,
                returnDelay: 0.05
            }
            : {
                ease: 'power1.inOut',
                durDrop: 0.4 * speedMultiplier,
                durMove: 0.4 * speedMultiplier,
                durReturn: 0.4 * speedMultiplier,
                promoteOverlap: 0.45,
                returnDelay: 0.2
            };

    const childArr = useMemo(() => Children.toArray(children), [children]);
    const refs = useMemo(
        () => childArr.map(() => React.createRef()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [childArr.length]
    );

    const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));

    const tlRef = useRef(null);
    const intervalRef = useRef();
    const container = useRef(null);

    useEffect(() => {
        if (refs.length === 0) return;

        const total = refs.length;
        refs.forEach((r, i) => {
            if (r.current) {
                placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
            }
        });

        const swap = () => {
            if (order.current.length < 2) return;

            const [front, ...rest] = order.current;
            const elFront = refs[front]?.current;
            if (!elFront) return;

            const tl = gsap.timeline();
            tlRef.current = tl;

            tl.to(elFront, {
                y: '+=500',
                duration: config.durDrop,
                ease: config.ease
            });

            tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
            rest.forEach((idx, i) => {
                const el = refs[idx]?.current;
                if (!el) return;
                const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
                tl.set(el, { zIndex: slot.zIndex }, 'promote');
                tl.to(
                    el,
                    {
                        x: slot.x,
                        y: slot.y,
                        z: slot.z,
                        duration: config.durMove,
                        ease: config.ease
                    },
                    `promote+=${i * 0.15}`
                );
            });

            const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
            tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
            tl.call(
                () => {
                    gsap.set(elFront, { zIndex: backSlot.zIndex });
                },
                undefined,
                'return'
            );
            tl.to(
                elFront,
                {
                    x: backSlot.x,
                    y: backSlot.y,
                    z: backSlot.z,
                    duration: config.durReturn,
                    ease: config.ease
                },
                'return'
            );

            tl.call(() => {
                order.current = [...rest, front];
            });
        };

        swap();

        // Visibility-based interval for performance optimization
        let isVisible = true;
        const startInterval = () => {
            if (!intervalRef.current && isVisible) {
                intervalRef.current = window.setInterval(swap, delay);
            }
        };
        const stopInterval = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    startInterval();
                } else {
                    stopInterval();
                    tlRef.current?.pause();
                }
            },
            { threshold: 0.1 }
        );

        if (container.current) {
            observer.observe(container.current);
        }
        startInterval();

        if (pauseOnHover && container.current) {
            const node = container.current;
            const pause = () => {
                tlRef.current?.pause();
                stopInterval();
            };
            const resume = () => {
                tlRef.current?.play();
                if (isVisible) startInterval();
            };
            node.addEventListener('mouseenter', pause);
            node.addEventListener('mouseleave', resume);
            return () => {
                node.removeEventListener('mouseenter', pause);
                node.removeEventListener('mouseleave', resume);
                observer.disconnect();
                stopInterval();
            };
        }
        return () => {
            observer.disconnect();
            stopInterval();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

    const rendered = childArr.map((child, i) =>
        isValidElement(child)
            ? cloneElement(child, {
                key: i,
                ref: refs[i],
                style: { width, height, ...(child.props.style ?? {}) },
                onClick: e => {
                    child.props.onClick?.(e);
                    onCardClick?.(i);
                }
            })
            : child
    );

    return (
        <div ref={container} className="card-swap-container" style={{ width, height }}>
            {rendered}
        </div>
    );
};

export default CardSwap;
