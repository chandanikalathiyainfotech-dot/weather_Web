
import React, { useState, useRef, useEffect } from "react";
import {
    animate,
    LazyMotion,
    motion,
    pinchFeatures,
    useMotionValue,
    useMotionValueEvent,
    useTransform,
    useScroll,
    useAnimate,
    arc,
    AnimatePresence,
    interpolate
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

const PRODUCT_SIZE = 160
const BASKET_BOX = 56
const FLY_SCALE = BASKET_BOX / PRODUCT_SIZE

const stage = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    fontFamily: "var(--font-mono)",
    color: "var(--foreground)"
}

const basket = {
    position: "absolute",
    bottom: 0,
    left: 400,
    width: BASKET_BOX,
    height: BASKET_BOX,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--layer)",
    border: "1px solid var(--border)",
    color: "var(--accent)",
    willChange: "transform",
}

const ring = {
    position: "absolute",
    inset: -1,
    border: "1px solid var(--accent)",
    opacity: 0,
    pointerEvents: "none",
    willChange: "transform, opacity",
}

const center = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 18,
}

const product = {
    width: PRODUCT_SIZE,
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--layer)",
    border: "1px solid var(--border)",
    willChange: "transform, opacity, clip-path",
}

const glyph = {
    fontSize: 84,
    lineHeight: 1,
    userSelect: "none",
}

const meta = {
    display: "flex",
    alignItems: "baseline",
    gap: 12,
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    letterSpacing: "0.04em",
}

const name = {
    color: "Helvetica Neue",
}

const price = {
    color: "Helvetica Neue",
}

const button = {
    marginTop: 4,
    padding: "13px 26px",
    border: "none",
    background: "#83E6F7",
    color: "black",
    fontFamily: "Helvetica Neue",
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    cursor: "pointer",
}


function BasketIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m15 11-1 9" />
            <path d="m19 11-4-7" />
            <path d="M2 11h20" />
            <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
            <path d="M4.5 15.5h15" />
            <path d="m5 11 4-7" />
            <path d="m9 11 1 9" />
        </svg>
    )
}

//holdto keep counting
function StepButton({ change, onStep, disabled }) {
    const scope = useRef(null)
    const snap = {
        type: "spring",
        stiffness: 500,
        damping: 25,
    }

    const lively = {
        type: "spring",
        stiffness: 400,
        damping: 20,
    }

    return (
        <motion.button
            ref={scope}
            className="st-step"
            aria-label={change > 0 ? "Add guest" : "Remove guest"}
            aria-disabled={disabled || undefined}
            disabled={disabled}

            tap={{ hold: 0.4, repeat: 0.08 }}
            onTapStart={() => onStep(change)}
            onTap={(event) => {
                if (event.type === "pointerup") return

                onStep(change)

                animate(
                    scope.current,
                    { scale: [0.82, 0.88] },
                    lively
                )
            }}
            whileTap={{ scale: 0.88, transition: snap }}
            transition={lively}
        >
            <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                aria-hidden="true"
            >
                <path
                    d={change > 0 ? "M4 9h10M9 4v10" : "M4 9h10"}
                />
            </svg>
        </motion.button>
    )
}

//double tap for like on post
function HeartBurst({ x, y, rotate, onDone }) {
    const [scope, animate] = useAnimate()
    const heart = useRef(null)

    useEffect(() => {
        const element = heart.current

        // A bouncy spring overshoots, so the heart pops
        animate(
            element,
            { scale: [0, 1], opacity: [0, 1], rotate: [0, rotate] },
            {
                type: "spring",
                visualDuration: 0.3,
                bounce: 0.6,
                opacity: { duration: 0.1 },
            },
        )

        // The exit runs on the container
        animate(
            scope.current,
            { y: -48, scale: 0.7, opacity: 0 },
            { duration: 0.35, ease: "easeIn", delay: 0.5 },
        ).then(onDone)
    }, [])

    return (
        <div ref={scope} className="dt-burst" style={{ left: x, top: y }}>
            {particles.map((angle, i) => (
                <motion.span
                    key={i}
                    className="dt-particle"
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{
                        x: Math.cos(angle) * 64,
                        y: Math.sin(angle) * 64,
                        scale: 0,
                        opacity: [1, 1, 0],
                    }}
                    transition={{
                        duration: 0.6,
                        ease: [0.2, 0, 0, 1],
                        delay: 0.06,
                    }}
                />
            ))}

            <svg
                ref={heart}
                className="dt-heart"
                width="96"
                height="96"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path d={heartPath} fill="#ffffff" />
            </svg>
        </div>
    )
}

const heartPath =
    "M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"

const particles = Array.from(
    { length: 8 },
    (_, i) => (i / 8) * Math.PI * 2 - Math.PI / 2,
)

//Path morphing
// Path morphing
const getIndex = (_, index) => index

function useFlubber(progress, paths) {
    return useTransform(progress, paths.map(getIndex), paths, {
        mixer: (a, b) => interpolate(a, b, { maxSegmentLength: 0.1 }),
    })
}

const star =
    "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
const heart =
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
const hand =
    "M23 5.5V20c0 2.2-1.8 4-4 4h-7.3c-1.08 0-2.1-.43-2.85-1.19L1 14.83s1.26-1.23 1.3-1.25c.22-.19.49-.29.79-.29.22 0 .42.06.6.16.04.01 4.31 2.46 4.31 2.46V4c0-.83.67-1.5 1.5-1.5S11 3.17 11 4v7h1V1.5c0-.83.67-1.5 1.5-1.5S15 .67 15 1.5V11h1V2.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V11h1V5.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5z"
const plane =
    "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
const lightning = "M7 2v11h3v9l7-12h-4l4-8z"
const note =
    "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"

const paths = [lightning, hand, plane, heart, note, star, lightning]
const colors = [
    "#fff312",
    "#ff0088",
    "#dd00ee",
    "#9911ff",
    "#0d63f8",
    "#0cdcf7",
    "#4ff0b7",
]

//motion component   function
function Motion({
    strength = 0.5,
    peak = 0.15,
    flyRotate = 0.9,
    duration = 0.45,
    basketVelocityFactor = 0.05,
    direction = "cw",
} = {}) {

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

    // addtocart effect

    const [scope, animate] = useAnimate()
    const productRef = useRef(null)
    const basketRef = useRef(null)
    const ringRef = useRef(null)
    const [isFlying, setIsFlying] = useState(false)

    const productX = useMotionValue(0)
    const productY = useMotionValue(0)

    const addToBasket = async () => {
        const product = productRef.current
        const basket = basketRef.current
        const ring = ringRef.current

        if (!product || !basket || !ring || isFlying) return

        setIsFlying(true)

        const from = product.getBoundingClientRect()
        const to = basket.getBoundingClientRect()

        const dx =
            to.left + to.width / 2 -
            (from.left + from.width / 2)

        const dy =
            to.top + to.height / 2 -
            (from.top + from.height / 2)

        // Fly product into basket
        await animate(
            product,
            {
                x: dx,
                y: dy,
                scale: FLY_SCALE,
                opacity: [1, 1, 0],
            },
            {
                duration,
                path: arc({
                    strength,
                    peak,
                    rotate: flyRotate,
                    direction: direction === "auto" ? undefined : direction,
                }),
                ease: [0.74, 0.18, 0.93, 0.69],
                opacity: {
                    inherit: true,
                    times: [0, 0.95, 1],
                },
            }
        )

        // Basket impact animation
        animate(
            basket,
            { x: 0, y: 0 },
            {
                type: "spring",
                stiffness: 500,
                damping: 12,
                x: {
                    inherit: true,
                    velocity: productX.getVelocity() * basketVelocityFactor,
                },
                y: {
                    inherit: true,
                    velocity: productY.getVelocity() * basketVelocityFactor,
                },
            }
        )

        // Basket ripple effect
        animate(
            ring,
            {
                scale: [1, 2.2],
                opacity: [0.8, 0],
            },
            {
                duration: 0.5,
                ease: "easeOut",
            }
        )

        // Reset invisible product
        animate(
            product,
            {
                x: 0,
                y: 0,
                scale: 0.9,
                rotate: 0,
                opacity: 0,
                clipPath: "inset(0%)",
            },
            { duration: 0 }
        )

        // Bring product back
        await animate(
            product,
            {
                opacity: 1,
                scale: 1,
            },
            {
                scale: {
                    type: "spring",
                    visualDuration: 0.4,
                    bounce: 0.35,
                },
                opacity: {
                    duration: 0.25,
                    ease: "easeOut",
                },
            }
        )

        setIsFlying(false)
    }

    //pinch or double tap
    const ui = { type: "spring", stiffness: 305, damping: 33 }

    const limit = (size, scale) =>
        Math.max(0, (size * (scale - 1)) / 2);

    const clampPan = (value, size, scale) =>
        Math.min(limit(size, scale), Math.max(-limit(size, scale), value));

    const viewer = useRef(null)
    const isDragging = useRef(false)

    const scale = useMotionValue(1)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const hintOpacity = useTransform(scale, [1, 1.15], [1, 0])
    const zoomOpacity = useTransform(scale, [1, 1.15], [0, 1])

    const [zoom, setZoom] = useState("1.0×")

    useMotionValueEvent(scale, "change", (latest) =>
        setZoom(latest.toFixed(1) + "×")
    )

    const settleEdges = (velocity = { x: 0, y: 0 }) => {
        const s = scale.get()
        const { offsetWidth: width, offsetHeight: height } = viewer.current

        animate(x, clampPan(x.get() + velocity.x * 0.2, width, s), {
            ...ui,
            velocity: velocity.x,
        })

        animate(y, clampPan(y.get() + velocity.y * 0.2, height, s), {
            ...ui,
            velocity: velocity.y,
        })
    }

    const settling = useRef(() => { })

    const afterZoomSettles = (callback) => {
        cancelFrame(settling.current)

        let last

        const check = (settling.current = () => {
            const latest = scale.get()

            if (latest === last) {
                cancelFrame(check)
                callback()
            }

            last = latest
        })

        frame.postRender(check, true)
    }

    const onDoubleTap = (_event, info) => {
        const rect = viewer.current.getBoundingClientRect()
        const current = scale.get()
        const target = current > 1.05 ? 1 : 2.5

        let px =
            info.point.x - window.scrollX - rect.left - rect.width / 2

        let py =
            info.point.y - window.scrollY - rect.top - rect.height / 2

        if (
            Math.abs(px) > rect.width / 2 ||
            Math.abs(py) > rect.height / 2
        ) {
            px = 0
            py = 0
        }

        const ratio = target / current

        animate(scale, target, ui)

        animate(
            x,
            clampPan(px - (px - x.get()) * ratio, rect.width, target),
            ui
        )

        animate(
            y,
            clampPan(py - (py - y.get()) * ratio, rect.height, target),
            ui
        )
    }

    //hold to keep counting
    const snap1 = { type: "spring", stiffness: 1218, damping: 70 }
    const ui1 = { type: "spring", stiffness: 305, damping: 33 }
    const lively = { type: "spring", stiffness: 622, damping: 17 }

    const min = 0
    const max = 99

    const [value, setValue] = useState(2)
    const [direction1, setDirection1] = useState(1)
    const [valueRef, animateValue] = useAnimate()
    const latest = useRef(value)

    const step = (change) => {
        const next = Math.min(max, Math.max(min, latest.current + change))

        if (next === latest.current) {
            // At a limit: a small shake says no
            animateValue(
                valueRef.current,
                { x: [0, 5 * change, -3 * change, 0] },
                { duration: 0.3 },
            )
            return
        }

        latest.current = next
        setDirection1(change)
        setValue(next)
    }

    //double tap for like post animation
    const ui2 = { type: "spring", stiffness: 305, damping: 33 }
    const lively2 = { type: "spring", stiffness: 622, damping: 17 }

    const red = "#ff3b5c"
    const photo = useRef(null)
    const [likeButton, animateLike] = useAnimate()
    const [isLiked, setIsLiked] = useState(false)
    const [bursts, setBursts] = useState([])
    const nextId = useRef(0)

    const setLiked = (liked) => {
        setIsLiked(liked)
        if (liked) {
            animateLike(likeButton.current, { scale: [1, 1.35, 1] }, lively)
        }
    }

    const onDoubleTap1 = (_event, info) => {
        const rect = photo.current.getBoundingClientRect()

        let x = info.point.x - window.scrollX - rect.left
        let y = info.point.y - window.scrollY - rect.top

        // Keyboard presses have no pointer position, so burst from the centre
        if (x <= 0 || y <= 0 || x >= rect.width || y >= rect.height) {
            x = rect.width / 2
            y = rect.height / 2
        }

        setBursts((current) => [
            ...current,
            {
                id: nextId.current++,
                x,
                y,
                rotate: Math.random() * 30 - 15,
            },
        ])

        setLiked(true)
    }

    //counter
    const count = useMotionValue(0)
    const rounded = useTransform(() => Math.round(count.get()))

    useEffect(() => {
        const controls = animate(count, 200, { duration: 3 })
        return () => controls.stop()
    }, [])

    const [count1, setCount1] = useState(0)

    function inc() {
        if (count1 < 200) {
            setCount1(count1 + 1)
        }
    }

    setTimeout(inc, 0.8);

    //toggle example
    const [isOn, setIsOn] = useState(false)
    const toggleSwitch = () => { setIsOn(!isOn) }

    const container = {
        width: 80,
        height: 40,
        backgroundColor: "#e3c8f7",
        borderRadius: 50,
        cursor: "pointer",
        display: "flex",
        padding: 10,
        marginBottom: 20,
        marginLeft: 40
    }

    const handle = {
        width: 23,
        height: 23,
        backgroundColor: '#9911FF',
        borderRadius: "50%",
    }

    //reloader animation
    const initialOrder = [
        "#1E75F7",
        "#DD00EE",
        "#9911FF",
        "#FF0088"
    ]

    function shuffle([...array]) {
        return array.sort(() => Math.random() - 0.5)
    }

    const spring = {
        type: "spring",
        damping: 20,
        stiffness: 300,
    }

    const container1 = {
        listStyle: "none",
        padding: 0,
        margin: 0,
        position: "relative",
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        width: 150,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10
    }

    const item = {
        width: 50,
        height: 50,
        borderRadius: "10px"
    }

    const [order, setOrder] = useState(initialOrder)

    useEffect(() => {
        const timeout = setTimeout(() => setOrder(shuffle(order)), 1000)
        return () => clearTimeout(timeout)
    }, [order])

    //shared layout animation
    const allIngredients = [
        { icon: "🍅", label: "Tomato" },
        { icon: "🥬", label: "Lecttuce" },
        { icon: "🧀", label: "Cheese" },
        { icon: "🥕", label: "Carrot" },
        { icon: "🍌", label: "Banana" },
        { icon: "🍇", label: "Grapes" },
        { icon: "🥂", label: "Champhes?" }
    ]

    const tabs = ["tomato", "lettuce", "cheese", "carrot", "banana", "grapes", "champhes"]
    const [selectedtab, setSelectedTab] = useState(allIngredients?.[0])

    const conatiner2 = {
        width: 600,
        height: 'fit-content',
        maxWidth: "calc(100% - 40px)",
        maxHeight: "calc(100% - 40px)",
        borderRadius: 10,
        background: "white",
        overflow: "hidden",
        boxShow: "0 1px 1px hsl(0deg 0% 0% / 0.075),0 2px 2px hsl(0deg 0% 0%  / 0.075),0 4px 4px hsl(0deg 0% 0% / 0.075),0 8px 8px hsl(0deg 0% 0% / 0.075),0 16px 16px hsl(0deg 0% 0% / 0.075)",
        display: "flex",
        flexdirecction: "column"
    }

    const nav = {
        background: '#fdfdfd',
        padding: "5px 5px 0",
        borderRadius: "10px",
        borderBottomLeftRaduis: 0,
        borderBottomRightRaduis: 0,
        borderBottom: "1px solid #eeeeee",
        height: 60,
    }

    const tabsStyles = {
        listStyle: "none",
        padding: 0,
        margin: 0,
        fontWeight: 500,
        fontSize: 14,
    }

    const tabsContainer = {
        ...tabsStyles,
        display: "flex",
        width: "100%",
        height: '100%'
    }

    const tab = {
        ...tabsStyles,
        borderRadius: 5,
        borderBottomLeftRaduis: 0,
        borederBottomRightRaduis: 0,
        width: "100%",
        padding: "10px 15px",
        position: "relative",
        background: "white",
        cursor: "pointer",
        height: '100%',
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        minWidth: 0,
        userSelect: "none",
        color: "black"
    }

    const underline = {
        position: "absolute",
        bottom: -2,
        left: 0,
        right: 0,
        height: 2,
        background: "blue"
    }

    const iconeContainer = {
        display: "flex",
        justifyContent: "center",
        alignItem: "center",
        flex: 1,
        width: 600,
    }

    const icon = {
        fontSize: 128
    }


    // value transform & path drawing
    const x1 = useMotionValue(0)
    const xInput = [-100, 0, 100]
    const background = useTransform(x1, xInput, [
        "linear-gradient(180deg, #ff008c 0%, rgb(211, 9, 225) 100%)",
        "linear-gradient(180deg, #7700ff 0%, rgb(68, 0, 255) 100%)",
        "linear-gradient(180deg, rgb(230, 255, 0) 0%, rgb(3, 209, 0) 100%)",
    ])
    const color = useTransform(x1, xInput, [
        "rgb(211, 9, 225)",
        "rgb(68, 0, 255)",
        "rgb(3, 209, 0)",
    ])
    const tickPath = useTransform(x1, [10, 100], [0, 1])
    const crossPathA = useTransform(x1, [-10, -55], [0, 1])
    const crossPathB = useTransform(x1, [-50, -100], [0, 1])

    const box2 = {
        width: 140,
        height: 140,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
    }

    const container3 = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        width: 500,
        height: 300,
        maxWidth: "100%",
        borderRadius: 20,
    }


    const [pathIndex, setPathIndex] = useState(0);
    const progress = useMotionValue(pathIndex);

    const fill = useTransform(progress, paths.map(getIndex), colors);
    const path = useFlubber(progress, paths);

    useEffect(() => {
        const animation = animate(progress, pathIndex, {
            duration: 0.8,
            ease: "easeInOut",
            onComplete: () => {
                if (pathIndex === paths.length - 1) {
                    progress.set(0);
                    setPathIndex(1);
                } else {
                    setPathIndex(pathIndex + 1);
                }
            },
        });

        return () => animation.stop();
    }, [pathIndex, progress]);


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
                    height: 5,
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

            {/* addtocarteffect */}
            <h3 className="mt-10 text-2xl font-bold flex items-center"><IoIosArrowRoundForward className="text-4xl font-bold" />Motion along a path / add to cart animation</h3>
            <div ref={scope} style={stage}>
                <style>{`#sandbox { position: relative }`}</style>

                <div ref={basketRef} style={basket}>
                    <motion.div ref={ringRef} style={ring} />
                    <BasketIcon />
                </div>

                <div style={center}>
                    <motion.div
                        ref={productRef}
                        style={{
                            ...product,
                            x: productX,
                            y: productY,
                        }}
                    >
                        <span style={glyph}>👟</span>
                    </motion.div>

                    <div style={meta}>
                        <span style={name}>Campus 00s</span>
                        <span style={price}>£128</span>
                    </div>

                    <motion.button
                        type="button"
                        onClick={addToBasket}
                        disabled={isFlying}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            ...button,
                            opacity: isFlying ? 0.55 : 1,
                            pointerEvents: isFlying ? "none" : "auto",
                        }}
                    >
                        Add to basket
                    </motion.button>
                </div>
            </div>

            {/* pinch or double tap */}
            <h3 className="mt-10 mb-5 text-2xl font-bold flex items-center"><IoIosArrowRoundForward className="text-4xl font-bold" />pinch or double tap</h3>
            <LazyMotion features={pinchFeatures}>
                <div className="pz-viewer">
                    <motion.div
                        ref={viewer}
                        className="pz-frame"
                        aria-label="Pinch or double tap to zoom"
                        tap={{ count: 2 }}
                        onTap={onDoubleTap}
                    >
                        <motion.img
                            className="pz-photo"
                            src="../../public/image/i1.png"
                            alt="A street in Tokyo at night"
                            draggable={false}
                            style={{ scale, x, y }}
                            pinch={{
                                scale: { min: 1, max: 4 },
                                rotate: false,
                                onStart: () => cancelFrame(settling.current),
                                onEnd: () =>
                                    !isDragging.current && afterZoomSettles(settleEdges),
                            }}
                            drag
                            dragMomentum={false}
                            onDragStart={() => {
                                isDragging.current = true
                                cancelFrame(settling.current)
                            }}
                            onDragEnd={(_event, info) => {
                                isDragging.current = false
                                afterZoomSettles(() => settleEdges(info.velocity))
                            }}
                        />
                    </motion.div>

                    <div className="pz-footer">
                        <div className="pz-caption">
                            <span className="pz-title">Shinjuku</span>
                            <span className="pz-meta">11:42 pm</span>
                        </div>

                        <div className="pz-status">
                            <motion.span
                                className="pz-hint"
                                style={{ opacity: hintOpacity }}
                            >
                                Pinch or double tap
                            </motion.span>

                            <motion.span
                                className="pz-zoom"
                                aria-live="polite"
                                style={{ opacity: zoomOpacity }}
                            >
                                {zoom}
                            </motion.span>
                        </div>
                    </div>

                    <Stylesheet2 />
                </div>
            </LazyMotion>

            {/* hold to keep counting */}
            <h3 className="mt-10 mb-5 text-2xl font-bold flex items-center"><IoIosArrowRoundForward className="text-4xl font-bold" />hold to keep counting</h3>
            <div className="st-stepper">
                <span className="st-title" id="guests-label">
                    Guests
                </span>
                <div className="st-control">
                    <StepButton change={-1} onStep={step} disabled={value === min} />
                    <div
                        ref={valueRef}
                        className="st-value"
                        role="status"
                        aria-labelledby="guests-label"
                    >
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.span
                                key={value}
                                className="st-digit"
                                custom={direction}
                                variants={{
                                    enter: (d) => ({
                                        y: 18 * d,
                                        opacity: 0,
                                        filter: "blur(4px)",
                                    }),
                                    center: { y: 0, opacity: 1, filter: "blur(0px)" },
                                    exit: (d) => ({
                                        y: -18 * d,
                                        opacity: 0,
                                        filter: "blur(4px)",
                                        transition: { ...snap1, opacity: { duration: 0.12 } },
                                    }),
                                }}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={ui1}
                            >
                                {value}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                    <StepButton change={1} onStep={step} disabled={value === max} />
                </div>
                <span className="st-hint">Hold to keep counting</span>
                <Stylesheet3 />
            </div>

            {/* double tap for add like on post */}
            <h3 className="mt-10 mb-5 text-2xl font-bold flex item-center"><IoIosArrowRoundForward className="text-4xl font-bold" />like on post on double click</h3>
            <div className="dt-post">
                <motion.div
                    ref={photo}
                    className="dt-photo"
                    tap={{ count: 2 }}
                    onTap={onDoubleTap1}
                    aria-label="Double tap to like"
                >
                    <img src="../../public/image/i1.png" alt="" draggable={false} />
                    {bursts.map((burst) => (
                        <HeartBurst
                            key={burst.id}
                            {...burst}
                            onDone={() =>
                                setBursts((current) => current.filter((b) => b.id !== burst.id))
                            }
                        />
                    ))}
                </motion.div>
                <div className="dt-footer">
                    <motion.button
                        ref={likeButton}
                        className="dt-like"
                        onTap={() => setLiked(!isLiked)}
                        whileTap={{ scale: 0.85 }}
                        transition={ui}
                        aria-label={isLiked ? "Unlike" : "Like"}
                        aria-pressed={isLiked}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                            <motion.path
                                d={heartPath}
                                initial={false}
                                animate={{
                                    fill: isLiked ? red : "rgba(255, 59, 92, 0)",
                                    stroke: isLiked ? red : "#18222e",
                                }}
                                transition={{ duration: 0.2 }}
                                strokeWidth={1.75}
                                strokeLinejoin="round"
                            />
                        </svg>
                    </motion.button>
                    <div className="dt-count">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                                key={isLiked ? "liked" : "unliked"}
                                initial={{
                                    y: isLiked ? 10 : -10,
                                    opacity: 0,
                                    filter: "blur(4px)",
                                }}
                                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                exit={{ y: isLiked ? -10 : 10, opacity: 0, filter: "blur(4px)" }}
                                transition={ui}
                            >
                                {isLiked ? "1,249" : "1,248"}
                            </motion.span>
                        </AnimatePresence>
                        <span className="dt-unit">likes</span>
                    </div>
                    <span className="dt-hint">Double tap the photo</span>
                </div>
                <Stylesheet4 />
            </div>

            {/* counter */}
            <h3 className="mt-10 mb-3 text-2xl font-bold flex items-center"><IoIosArrowRoundForward className="text-4xl font-bold" /> Counter</h3>
            <motion.div
                style={{
                    fontFamily: "Segoe UI",
                    fontSize: 40,
                    lineHeight: 1,
                    color: "var(--hue-6)",
                    marginLeft: 40
                }}
            >
                {rounded}
            </motion.div>
            <p>{count1}</p>

            {/* toggleswitch example */}
            <h3 className="mt-10 mb-3 text-2xl font-bold flex item-center"><IoIosArrowRoundForward className="text-4xl font-bold" />Toggle Switch</h3>
            <button className="toggle-container"
                style={{
                    ...container,
                    justifyContent: "flex-" + (isOn ? "start" : "end")
                }}
                onClick={toggleSwitch}
            >
                <motion.div
                    className="toggle-handle"
                    style={handle}
                    layout
                    transition={{
                        type: "spring",
                        visualDuration: 0.2,
                        bounce: 0.2,
                    }}
                />
            </button>

            {/* reloader animation */}
            <h3 className="mt-10 mb-3 text-2xl font-bold flex item-center"><IoIosArrowRoundForward className="text-4xl font-bold" />Reloader Animation</h3>
            <ul style={container1}>
                {
                    order.map((backgroundColor) => (
                        <motion.li
                            key={backgroundColor}
                            layout
                            transition={spring}
                            style={{ ...item, backgroundColor }}
                        />
                    ))
                }
            </ul>


            {/*shared layout animation*/}
            <h3 className="mt-10 mb-3 text-2xl font-bold flex item-center"><IoIosArrowRoundForward className="text-4xl font-bold" />Shared layout animation</h3>
            <div style={conatiner2}>
                <nav style={nav}>
                    <ul style={tabsContainer}>
                        {
                            allIngredients.map((item) => (
                                <motion.li
                                    key={item.label}
                                    initial={false}
                                    animate={{
                                        backgroundColor:
                                            item === selectedtab ? "#eee" : "#eee0",
                                    }}
                                    style={tab}
                                    onClick={() => setSelectedTab(item)}
                                >
                                    {`${item.icon} ${item.label}`}
                                    {item.label === selectedtab.label ?
                                        <motion.div
                                            style={underline}
                                            layoutId="underline"
                                            id="underline"
                                        />
                                        : null}
                                </motion.li>
                            ))
                        }
                    </ul>
                </nav>
            </div>
            <main style={iconeContainer}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedtab ? selectedtab.label : "empty"}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 10, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={icon}
                    >
                        {selectedtab ? selectedtab.icon : "-"}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* value transform & path drawing */}
            <h3 className="mt-10 mb-3 text-2xl font-bold flex item-center"><IoIosArrowRoundForward className="text-4xl font-bold" />Value transform & path drawing</h3>
            <div>
                <motion.div style={{ ...container3, background }}>
                    <motion.div
                        className="icon-container"
                        style={{ ...box2, x: x1 }}
                        drag="x"
                        dragConstraints={{ left: -100, right: 100 }}
                        dragElastic={0.2}
                    >
                        <svg className="progress-icon" viewBox="0 0 50 50">
                            <motion.path
                                fill="none"
                                strokeWidth="2"
                                stroke={color}
                                d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
                                style={{
                                    x: 5,
                                    y: 5,
                                }}
                            />
                            <motion.path
                                id="tick"
                                fill="none"
                                strokeWidth="2"
                                stroke={color}
                                d="M14,26 L 22,33 L 35,16"
                                strokeDasharray="1 1"
                                style={{ pathLength: tickPath }}
                            />
                            <motion.path
                                fill="none"
                                strokeWidth="2"
                                stroke={color}
                                d="M17,17 L33,33"
                                strokeDasharray="0 1"
                                style={{ pathLength: crossPathA }}
                            />
                            <motion.path
                                id="cross"
                                fill="none"
                                strokeWidth="2"
                                stroke={color}
                                d="M33,17 L17,33"
                                strokeDasharray="0 1"
                                style={{ pathLength: crossPathB }}
                            />
                        </svg>
                    </motion.div>
                </motion.div>
            </div>

            {/* Path morphing */}
            <h3 className="mt-10 mb-3 text-2xl font-bold flex item-center"><IoIosArrowRoundForward className="text-4xl font-bold" />Path morphing</h3>
            <svg width="400" height="400">
                <g transform="translate(10 10) scale(17 17)">
                    <motion.path fill={fill} d={path} />
                </g>
            </svg>
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

function Stylesheet2() {
    return (
        <style>{`
      .pz-viewer {
        width: min(340px, calc((100vh - 120px) * 0.75));
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

      .pz-frame {
        position: relative;
        aspect-ratio: 3 / 4;
        border-radius: 16px;
        overflow: hidden;
        background: #0b0d10;
        cursor: zoom-in;
        touch-action: none;
        -webkit-tap-highlight-color: transparent;
        isolation: isolate;
      }

      .pz-frame:focus-visible {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
      }

      .pz-photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        cursor: grab;
      }

      .pz-photo:active {
        cursor: grabbing;
      }

      .pz-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 8px 6px;
      }

      .pz-caption {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .pz-title {
        font-size: 14px;
        font-weight: 600;
        color: #18222e;
      }

      .pz-meta {
        font-size: 13px;
        color: #9aa1ae;
      }

      .pz-status {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        min-width: 130px;
        height: 28px;
      }

      .pz-hint {
        font-size: 13px;
        color: #9aa1ae;
        white-space: nowrap;
      }

      .pz-zoom {
        position: absolute;
        right: 0;
        padding: 4px 10px;
        border-radius: 999px;
        background: #18222e;
        color: #ffffff;
        font-size: 13px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
    `}</style>
    )
}

function Stylesheet3() {
    return (
        <style>{`
      .st-stepper {
        display: flex;
        flex-direction: column;
        margin-bottom:20px;
        gap: 14px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        user-select: none;
        -webkit-user-select: none;
      }

      .st-title {
        font-size: 13px;
        font-weight: 500;
        color: #60687a;
      }

      .st-hint {
        font-size: 13px;
        color: #9aa1ae;
      }

      .st-control {
        display: flex;
        align-items: center;
        width:fit-content;
        gap: 4px;
        padding: 6px;
        border-radius: 999px;
        background: #ffffff;
        box-shadow:
          0 0 0 1px rgba(24, 34, 46, 0.06),
          0 1px 2px rgba(24, 34, 46, 0.06),
          0 8px 24px rgba(24, 34, 46, 0.08);
      }

      .st-step {
        width: 48px;
        height: 48px;
        border: none;
        border-radius: 50%;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f1f3f6;
        color: #18222e;
        cursor: pointer;
        touch-action: none;
        -webkit-touch-callout: none;
        transition:
          background-color 0.2s,
          color 0.2s;
      }

      .st-step:hover {
        background: #e8ebf0;
      }

      .st-step[aria-disabled] {
        color: #b8bec9;
      }

      .st-step:focus-visible {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
      }

      .st-step path {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.75;
        stroke-linecap: round;
      }

      .st-value {
        position: relative;
        width: 72px;
        height: 48px;
        overflow: hidden;
      }

      .st-digit {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        font-weight: 600;
        letter-spacing: -0.02em;
        font-variant-numeric: tabular-nums;
        color: #18222e;
      }
    `}</style>
    )
}

function Stylesheet4() {
    return (
        <style>{`
      .dt-post {
        width: min(300px, calc(100vh - 140px));
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

      .dt-photo {
        position: relative;
        aspect-ratio: 1;
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }

      .dt-photo:focus-visible {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
      }

      .dt-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        pointer-events: none;
      }

      .dt-burst {
        position: absolute;
        width: 0;
        height: 0;
        pointer-events: none;
      }

      .dt-heart {
        opacity: 0;
        transform: scale(0);
        position: absolute;
        left: -48px;
        top: -48px;
        filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.25));
      }

      .dt-particle {
        position: absolute;
        left: -4px;
        top: -4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ffffff;
      }

      .dt-footer {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 8px 6px;
      }

      .dt-like {
        width: 36px;
        height: 36px;
        margin: -4px;
        padding: 0;
        border: none;
        border-radius: 50%;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .dt-like:focus-visible {
        outline: 2px solid #2563eb;
      }

      .dt-count {
        position: relative;
        display: flex;
        gap: 4px;
        font-size: 14px;
        font-weight: 600;
        color: #18222e;
        font-variant-numeric: tabular-nums;
      }

      .dt-count > span:first-child {
        display: inline-block;
      }

      .dt-unit {
        font-weight: 400;
        color: #60687a;
      }

      .dt-hint {
        margin-left: auto;
        font-size: 13px;
        color: #9aa1ae;
        white-space: nowrap;
      }

      @media (max-height: 420px) {
        .dt-hint {
          display: none;
        }
      }
    `}</style>
    )
}
