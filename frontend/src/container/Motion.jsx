
import React, { useState, useRef, useEffect } from "react";
import {
    animate,
    LazyMotion,
    motion,
    pinchFeatures,
    useMotionValue,
    useMotionValueEvent,
    useTransform,
    useScroll
} from "motion/react"
import { IoIosArrowRoundForward } from "react-icons/io";


function Content() {
    return (
        <>
            <article
                style={{
                    maxWidth: 500,
                    padding: "0px 0px 80px 0px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                }}
            >
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Aliquam ac rhoncus quam.
                </p>
                <p>
                    Fringilla quam urna. Cras turpis elit, euismod eget ligula
                    quis, imperdiet sagittis justo. In viverra fermentum ex ac
                    vestibulum. Aliquam eleifend nunc a luctus porta. Mauris
                    laoreet augue ut felis blandit, at iaculis odio ultrices.
                    Nulla facilisi. Vestibulum cursus ipsum tellus, eu tincidunt
                    neque tincidunt a.
                </p>
                <h2>Sub-header</h2>
                <p>
                    In eget sodales arcu, consectetur efficitur metus. Duis
                    efficitur tincidunt odio, sit amet laoreet massa fringilla
                    eu.
                </p>
                <p>
                    Pellentesque id lacus pulvinar elit pulvinar pretium ac non
                    urna. Mauris id mauris vel arcu commodo venenatis. Aliquam
                    eu risus arcu. Proin sit amet lacus mollis, semper massa ut,
                    rutrum mi.
                </p>
                <p>
                    Sed sem nisi, luctus consequat ligula in, congue sodales
                    nisl.
                </p>
                <p>
                    Vestibulum bibendum at erat sit amet pulvinar. Pellentesque
                    pharetra leo vitae tristique rutrum. Donec ut volutpat ante,
                    ut suscipit leo.
                </p>
                <h2>Sub-header</h2>
                <p>
                    Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum
                    fringilla aliquet. Pellentesque auctor vehicula malesuada.
                    Aliquam id feugiat sem, sit amet tempor nulla. Quisque
                    fermentum felis faucibus, vehicula metus ac, interdum nibh.
                    Curabitur vitae convallis ligula. Integer ac enim vel felis
                    pharetra laoreet. Interdum et malesuada fames ac ante ipsum
                    primis in faucibus. Pellentesque hendrerit ac augue quis
                    pretium.
                </p>
                <p>
                    Morbi ut scelerisque nibh. Integer auctor, massa non dictum
                    tristique, elit metus efficitur elit, ac pretium sapien nisl
                    nec ante. In et ex ultricies, mollis mi in, euismod dolor.
                </p>
                <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
                <p>
                    Pellentesque id lacus pulvinar elit pulvinar pretium ac non
                    urna. Mauris id mauris vel arcu commodo venenatis. Aliquam
                    eu risus arcu. Proin sit amet lacus mollis, semper massa ut,
                    rutrum mi.
                </p>


            </article>
        </>
    )
}

const ui = { type: "spring", stiffness: 305, damping: 33 };
const lively = { type: "spring", stiffness: 622, damping: 17 };

const hold = 1;
const circumference = 2 * Math.PI * 72;

const ringState = {
    locked: "rest",
    holding: "pressed",
    unlocked: "unlocked",
};

const labels = {
    locked: "Hold to unlock",
    holding: "Keep holding",
    unlocked: "Unlocked",
};

//Pinch to rotate
const snappy = {
    type: "spring",
    stiffness: 420,
    damping: 32,
}

const pixelsPerDegree = 3

const normalise = (degrees) =>
    ((Math.round(degrees) % 360) + 360) % 360


//motion component   function
function Motion() {

    const [state, setState] = useState("locked");

    const wasUnlocked = useRef(false)
    useEffect(() => {
        wasUnlocked.current = state === "unlocked"
    }, [state])

    const unlock = () => {
        navigator.vibrate?.(12)
        setState("unlocked")
    }

    // Lock again a moment after unlocking
    useEffect(() => {
        if (state !== "unlocked") return
        const timeout = setTimeout(() => setState("locked"), 1800)
        return () => clearTimeout(timeout)
    }, [state])

    const isUnlocked = state === "unlocked"

    const box = {
        width: 100,
        height: 100,
        backgroundColor: "tomato",
        borderRadius: 5,
    };

    const ball = {
        width: 100,
        height: 100,
        backgroundColor: "blue",
        borderRadius: "50%",
    }

    const btn = {
        padding: 10,
        backgroundColor: "#00B8A7",
        color: 'white',
        height: 'fit-content'
    }

    const box1 = {
        width: 100,
        height: 100,
        backgroundColor: "#32a840",
        borderRadius: 5,
    }

    const { scrollYProgress } = useScroll()
    const transform = useTransform(
        scrollYProgress,
        [0, 1],
        ["scaleX(0)", "scaleX(1)"]
    )

    const rotate = useMotionValue(0)

    // 50% puts the 0 tick under the needle
    const ticksX = useTransform(
        () => `calc(50% - 0.75px + ${-rotate.get() * pixelsPerDegree}px)`,
    )

    const [degrees, setDegrees] = useState(0)

    useMotionValueEvent(rotate, "change", (latest) =>
        setDegrees(normalise(latest)),
    )

    // The dial snaps to the nearest quarter turn
    const snap = () =>
        animate(rotate, Math.round(rotate.get() / 90) * 90, snappy)

    /**
     * Trackpad pinches in Chrome and Firefox only report scale,
     * so the dial rotates the photo too.
     */
    const onDialDown = (event) => {
        const dial = event.currentTarget
        rotate.stop()
        dial.setPointerCapture(event.pointerId)

        const startX = event.clientX
        const startRotate = rotate.get()

        const move = (moveEvent) => {
            if (moveEvent.pointerId !== event.pointerId) return

            rotate.set(
                startRotate -
                (moveEvent.clientX - startX) / pixelsPerDegree
            )
        }

        const end = (endEvent) => {
            if (endEvent.pointerId !== event.pointerId) return

            window.removeEventListener("pointermove", move)
            window.removeEventListener("pointerup", end)
            window.removeEventListener("pointercancel", end)

            snap()
        }

        // The window lets dragging continue outside the dial
        window.addEventListener("pointermove", move)
        window.addEventListener("pointerup", end)
        window.addEventListener("pointercancel", end)
    }

    const onDialKey = (event) => {
        const direction =
            event.key === "ArrowRight" ? 1 :
                event.key === "ArrowLeft" ? -1 : 0

        if (!direction) return

        event.preventDefault()

        animate(
            rotate,
            Math.round(rotate.get() / 90) * 90 + direction * 90,
            snappy
        )
    }


    return (
        <div className="mt-20 ml-20">
            <h3 className="mb-5 text-2xl font-bold flex items-center"><IoIosArrowRoundForward className="text-4xl font-bold" />Transforms,Enter animations,button,hover,Keyframes</h3>
            <div className="flex gap-10 mt-10 items-center">
                <motion.div
                    style={box}
                    animate={{ rotate: 360 }}

                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.4,
                        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                    }}
                    style={ball}
                />

                <motion.button
                    style={btn}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => console.log('hover started!')}
                >
                    Click Me
                </motion.button>

                <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    style={box}
                />

                <motion.div
                    animate={{
                        scale: [1, 2, 2, 1, 1],
                        rotate: [0, 0, 180, 180, 0],
                        borderRadius: ["0%", "0%", "50%", "50%", "0%"]
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        times: [0, 0.2, 0.5, 0.8, 1],
                        repeat: Infinity,
                        repeatDelay: 1
                    }}
                    style={box1}
                />
            </div>

            <h3 className="mt-20 mb-5 text-2xl font-bold flex items-center"><IoIosArrowRoundForward className="text-4xl font-bold" />Scrollbar progress</h3>
            <motion.div
                id="scroll-indicator"
                style={{
                    transform,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 10,
                    originX: 0,
                    backgroundColor: "#fc03e3",
                }}
            />
            <Content />

            {/* lock ,unlock */}
            <h3 className="mb-5 text-2xl font-bold flex items-center"><IoIosArrowRoundForward className="text-4xl font-bold" />Lock,unLock</h3>
            <div className="lp-lock">
                <div className="lp-dial">
                    <motion.svg
                        className="lp-ring"
                        width="160"
                        height="160"
                        viewBox="0 0 160 160"
                        aria-hidden="true"
                        initial={false}
                        animate={isUnlocked ? "unlocked" : "rest"}
                        variants={{
                            rest: { scale: 1, opacity: 1, transition: { duration: 0 } },
                            // The ring pulses out as the lock opens
                            unlocked: {
                                scale: [1, 1.1],
                                opacity: [1, 0],
                                transition: { duration: 0.5, ease: [0.2, 0, 0, 1] },
                            },
                        }}
                    >
                        <circle className="lp-track" cx="80" cy="80" r="72" />
                        <motion.circle
                            className="lp-progress"
                            cx="80"
                            cy="80"
                            r="72"
                            strokeDasharray={circumference}
                            // An attribute, not a class rule, so the unlock can turn it green
                            stroke="#18222e"
                            initial={false}
                            animate={ringState[state]}
                            custom={wasUnlocked.current}
                            variants={{
                                rest: (fromUnlocked) => ({
                                    strokeDashoffset: circumference,
                                    opacity: 0,
                                    stroke: "#18222e",
                                    transition: fromUnlocked ? { duration: 0 } : ui,
                                }),
                                pressed: {
                                    strokeDashoffset: 0,
                                    opacity: 1,
                                    transition: {
                                        strokeDashoffset: { duration: hold, ease: "linear" },
                                        opacity: { duration: 0.1 },
                                    },
                                },
                                unlocked: {
                                    strokeDashoffset: 0,
                                    opacity: 1,
                                    stroke: "#2fbf71",
                                    transition: { duration: 0.2 },
                                },
                            }}
                            // The ring is full after `hold` seconds: unlock while still held
                            onAnimationComplete={(definition) =>
                                definition === "pressed" && unlock()
                            }
                        />
                    </motion.svg>
                    <motion.button
                        className="lp-button"
                        aria-label="Hold to unlock"
                        tap={{ hold }}
                        onTapStart={() => !isUnlocked && setState("holding")}
                        onTapCancel={() => !isUnlocked && setState("locked")}
                        initial={false}
                        animate={isUnlocked ? "unlocked" : "rest"}
                        whileTap={isUnlocked ? undefined : "pressed"}
                        variants={{
                            rest: { scale: 1, backgroundColor: "#ffffff", color: "#18222e" },
                            pressed: { scale: 0.92 },
                            unlocked: {
                                scale: 1,
                                backgroundColor: "#2fbf71",
                                color: "#ffffff",
                            },
                        }}

                        transition={{
                            ...lively,
                            backgroundColor: { duration: 0.3 },
                            color: { duration: 0.3 },
                        }}
                    >
                        <svg
                            className="lp-icon"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <motion.path
                                className="lp-shackle"
                                d="M8 11V7.5a4 4 0 0 1 8 0V11"
                                variants={{
                                    rest: { y: 0 },
                                    pressed: { y: -1 },
                                    unlocked: { y: -4 },
                                }}
                                transition={lively}
                            />
                            <rect
                                className="lp-body"
                                x="5"
                                y="11"
                                width="14"
                                height="10"
                                rx="2.5"
                            />
                            <circle className="lp-keyhole" cx="12" cy="16" r="1.25" />
                        </svg>
                    </motion.button>
                </div>
                <motion.p
                    key={state}
                    className="lp-label"
                    aria-live="polite"
                    initial={{ opacity: 0, filter: "blur(4px)", y: 4 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={ui}
                >
                    {labels[state]}
                </motion.p>
                <Stylesheet />
            </div>

            {/* Pinch to rotate */}
            <h3 className="mb-5 text-2xl font-bold flex items-center"><IoIosArrowRoundForward className="text-4xl font-bold" />Pinch to rotate</h3>
            <LazyMotion features={pinchFeatures}>
                <div className="pr-editor">
                    <div className="pr-frame" aria-label="Twist with two fingers to rotate">
                        <motion.img
                            className="pr-photo"
                            src="../../public/image/i1.png"
                            alt="A red neon sign in Tokyo"
                            draggable={false}
                            style={{ rotate }}
                            // rotate.snap turns it to the nearest quarter turn on release
                            pinch={{ rotate: { snap: 90 }, scale: false, pan: false }}
                        />
                    </div>
                    <div className="pr-controls">
                        <span className="pr-angle" aria-live="polite">
                            {degrees}°
                        </span>
                        <div
                            className="pr-dial"
                            role="slider"
                            tabIndex={0}
                            aria-label="Rotation"
                            aria-valuemin={0}
                            aria-valuemax={359}
                            aria-valuenow={degrees}
                            onPointerDown={onDialDown}
                            onKeyDown={onDialKey}
                        >
                            <motion.div
                                className="pr-ticks"
                                style={{ backgroundPositionX: ticksX }}
                            />
                            <div className="pr-needle" />
                        </div>
                        <span className="pr-hint">
                            Twist with two fingers, or drag the dial
                        </span>
                    </div>
                    <Stylesheet1 />
                </div>
            </LazyMotion>
        </div>
    );
}

export default Motion;

function Stylesheet() {
    return (
        <style>{`
      .lp-lock {
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        user-select: none;
        -webkit-user-select: none;
        margin-bottom:40px;
        justify-content:center;
        width:fit-content;
        text-align:center;
      }

      .lp-dial {
        position: relative;
        width: 160px;
        height: 160px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .lp-ring {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .lp-ring circle {
        transform: rotate(-90deg);
        transform-origin: center;
        fill: none;
        stroke-width: 5;
        stroke-linecap: round;
      }

      .lp-track {
        stroke: #eceef2;
      }

      .lp-button {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: none;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        background: #ffffff;
        color: #18222e;
        box-shadow:
          0 0 0 1px rgba(24, 34, 46, 0.06),
          0 1px 2px rgba(24, 34, 46, 0.06),
          0 8px 24px rgba(24, 34, 46, 0.08);
        cursor: pointer;
        touch-action: none;
        -webkit-touch-callout: none;
      }

      .lp-button:focus-visible {
        outline: 2px solid #2563eb;
        outline-offset: 6px;
      }

      .lp-icon {
        overflow: visible;
      }

      .lp-shackle,
      .lp-body {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.75;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .lp-keyhole {
        fill: currentColor;
      }

      .lp-label {
        margin: 0;
        font-size: 15px;
        font-weight: 500;
        letter-spacing: -0.01em;
        color: #60687a;
      }
    `}</style>
    )
}

function Stylesheet1() {
    return (
        <style>{`
      .pr-editor {
        width: min(340px, calc(100vh - 220px));
        padding: 8px;
        border-radius: 24px;
        background: #ffffff;
        box-shadow:
          0 0 0 1px rgba(24, 34, 46, 0.06),
          0 1px 2px rgba(24, 34, 46, 0.06),
          0 12px 32px rgba(24, 34, 46, 0.1);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        user-select: none;
        -webkit-user-select: none;
      }

      .pr-frame {
        aspect-ratio: 1;
        border-radius: 16px;
        background:
          radial-gradient(circle, rgba(24, 34, 46, 0.08) 1px, transparent 1.5px)
            0 0 / 12px 12px,
          #f1f3f6;
        display: flex;
        align-items: center;
        justify-content: center;
        touch-action: none;
      }

      .pr-photo {
        width: 72%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 12px;
        box-shadow:
          0 1px 2px rgba(24, 34, 46, 0.12),
          0 12px 28px rgba(24, 34, 46, 0.22);
        display: block;
      }

      .pr-controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 14px 8px 8px;
      }

      .pr-angle {
        font-size: 15px;
        font-weight: 600;
        color: #18222e;
        font-variant-numeric: tabular-nums;
      }

      .pr-dial {
        position: relative;
        width: 100%;
        height: 28px;
        cursor: ew-resize;
        touch-action: none;
        mask-image: linear-gradient(
          to right,
          transparent,
          #000 25%,
          #000 75%,
          transparent
        );
      }

      .pr-dial:focus-visible {
        outline: 2px solid #2563eb;
        outline-offset: 4px;
        border-radius: 6px;
      }

      .pr-ticks {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(to right, #18222e 1.5px, transparent 1.5px),
          linear-gradient(to right, #c3c8d2 1px, transparent 1px);
        background-size:
          135px 18px,
          15px 12px;
        background-repeat: repeat-x;
        background-position: calc(50% - 0.75px) center;
      }

      .pr-needle {
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 2px;
        margin-left: -1px;
        border-radius: 1px;
        background: #ff3b5c;
      }

      .pr-hint {
        font-size: 13px;
        color: #9aa1ae;
      }
    `}</style>
    )
}
