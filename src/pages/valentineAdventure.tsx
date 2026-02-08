import { useState, useEffect, useRef } from 'react';
import { Heart, Unlock, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Skull } from 'lucide-react';
import GameStart from '../components/GameStart';

// Define the shape of items your state will hold
interface Item {
  id: number;
  x: number;
  y: number;
  type: string;
  message: string;
  emoji: string;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface VillainConfig {
  id: string;
  startX: number;
  startY: number;
  path: string;
  range: number;
  speed: number;
  emoji: string;
}

interface Level {
  name: string;
  theme: string;
  difficulty: string;
  items: Item[];
  obstacles: Obstacle[];
  villains: VillainConfig[];
}

type Villain = {
  id: string;
  x: number;
  y: number;
  angle: number;
  startX: number;
  startY: number;
  path: string;
  range: number;
  speed: number;
  emoji: string;
};

type Projectile = {
  id: number;
  x: number;
  y: number;
  angle: number;
};

export default function ValentineAdventure() {
  const [character, setCharacter] = useState({ x: 60, y: 50 });
  const [collected, setCollected] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  const [showMessage, setShowMessage] = useState<Item | null>(null);
  const [particles, setParticles] = useState<Projectile[]>([]);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [levelStartTime, setLevelStartTime] = useState(Date.now());
  const [timeBonus, setTimeBonus] = useState(0);
  const [lives, setLives] = useState(10);
  const [isInvincible, setIsInvincible] = useState(false);
  const [villains, setVillains] = useState<Villain[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const moveIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const levels: Level[] = [
    {
      name: "Rose Garden 🌹",
      theme: "from-pink-100 to-red-100",
      difficulty: "Easy",
      items: [
        { id: 1, x: 20, y: 30, type: 'heart', message: "You light up my world like nobody else! ✨", emoji: '💖' },
        { id: 2, x: 80, y: 20, type: 'star', message: "Every moment with you is pure magic! 🌟", emoji: '⭐' },
        { id: 3, x: 15, y: 70, type: 'gift', message: "You're the best gift life has given me! 🎁", emoji: '🎁' },
        { id: 4, x: 85, y: 75, type: 'sparkle', message: "Your smile makes my heart dance! 💃", emoji: '✨' },
      ],
      obstacles: [
        { x: 40, y: 40, width: 8, height: 8 },
        { x: 60, y: 30, width: 10, height: 6 },
      ],
      villains: [
        { id: 'v1', startX: 30, startY: 50, path: 'horizontal', range: 20, speed: 0.3, emoji: '😈' },
      ]
    },
    {
      name: "Chocolate Paradise 🍫",
      theme: "from-amber-100 to-orange-100",
      difficulty: "Easy",
      items: [
        { id: 5, x: 50, y: 15, type: 'heart', message: "I fall for you more every single day! 🌹", emoji: '💝' },
        { id: 6, x: 30, y: 85, type: 'star', message: "You and me = forever! 💍", emoji: '🌠' },
        { id: 7, x: 70, y: 50, type: 'gift', message: "Thank you for being my everything! 🥰", emoji: '🎀' },
        { id: 8, x: 45, y: 60, type: 'sparkle', message: "My favorite place is wherever you are! 🏠", emoji: '💫' },
        { id: 9, x: 90, y: 40, type: 'heart', message: "You complete me in every way! 🧩", emoji: '💕' },
      ],
      obstacles: [
        { x: 25, y: 25, width: 6, height: 15 },
        { x: 55, y: 35, width: 12, height: 8 },
        { x: 35, y: 55, width: 8, height: 10 },
      ],
      villains: [
        { id: 'v2', startX: 40, startY: 30, path: 'vertical', range: 25, speed: 0.2, emoji: '👻' },
        { id: 'v3', startX: 70, startY: 70, path: 'horizontal', range: 15, speed: 0.2, emoji: '😈' },
      ]
    },
    {
      name: "Starlight Dreams ⭐",
      theme: "from-purple-100 to-indigo-100",
      difficulty: "Medium",
      items: [
        { id: 10, x: 25, y: 25, type: 'heart', message: "You make every day feel like Valentine's Day! 💌", emoji: '💗' },
        { id: 11, x: 75, y: 25, type: 'star', message: "In a world full of chaos, you're my peace! 🕊️", emoji: '🌟' },
        { id: 12, x: 50, y: 50, type: 'gift', message: "Life with you is the greatest adventure! 🗺️", emoji: '🎁' },
        { id: 13, x: 25, y: 75, type: 'sparkle', message: "You're my dream come true! 🌈", emoji: '✨' },
        { id: 14, x: 75, y: 75, type: 'heart', message: "Forever isn't long enough with you! ⏰", emoji: '💖' },
        { id: 15, x: 10, y: 50, type: 'star', message: "You're my favorite everything! 🎯", emoji: '⭐' },
      ],
      obstacles: [
        { x: 30, y: 10, width: 6, height: 12 },
        { x: 64, y: 10, width: 6, height: 12 },
        { x: 15, y: 35, width: 10, height: 6 },
        { x: 75, y: 35, width: 10, height: 6 },
        { x: 45, y: 65, width: 10, height: 8 },
      ],
      villains: [
        { id: 'v4', startX: 50, startY: 20, path: 'circle', range: 15, speed: 0.3, emoji: '💀' },
        { id: 'v5', startX: 20, startY: 60, path: 'horizontal', range: 30, speed: 0.3, emoji: '👻' },
      ]
    },
    {
      name: "Love Castle 🏰",
      theme: "from-rose-100 to-pink-100",
      difficulty: "Medium",
      items: [
        { id: 16, x: 15, y: 15, type: 'heart', message: "You're the queen of my heart! 👑", emoji: '💝' },
        { id: 17, x: 85, y: 15, type: 'star', message: "Our love story is my favorite! 📖", emoji: '🌠' },
        { id: 18, x: 50, y: 30, type: 'gift', message: "Every kiss is like the first! 💋", emoji: '🎀' },
        { id: 19, x: 15, y: 85, type: 'sparkle', message: "You're my happily ever after! 🏰", emoji: '💫' },
        { id: 20, x: 85, y: 85, type: 'heart', message: "I choose you, today and always! 💒", emoji: '💕' },
        { id: 21, x: 30, y: 50, type: 'star', message: "You're my sunshine on cloudy days! ☀️", emoji: '⭐' },
        { id: 22, x: 70, y: 50, type: 'gift', message: "Together we can conquer anything! 💪", emoji: '🎁' },
      ],
      obstacles: [
        { x: 22, y: 30, width: 6, height: 25 },
        { x: 72, y: 30, width: 6, height: 25 },
        { x: 45, y: 5, width: 10, height: 10 },
        { x: 38, y: 70, width: 6, height: 8 },
        { x: 56, y: 70, width: 6, height: 8 },
      ],
      villains: [
        { id: 'v6', startX: 50, startY: 60, path: 'horizontal', range: 25, speed: 0.3, emoji: '😈' },
        { id: 'v7', startX: 40, startY: 20, path: 'vertical', range: 20, speed: 0.3, emoji: '💀' },
        { id: 'v8', startX: 60, startY: 80, path: 'vertical', range: 20, speed: 0.3, emoji: '👻' },
      ]
    },
    {
      name: "Rainbow Bridge 🌈",
      theme: "from-cyan-100 to-blue-100",
      difficulty: "Medium",
      items: [
        { id: 23, x: 10, y: 20, type: 'heart', message: "You color my world beautiful! 🎨", emoji: '💝' },
        { id: 24, x: 50, y: 10, type: 'star', message: "With you, anything is possible! 🚀", emoji: '🌟' },
        { id: 25, x: 90, y: 20, type: 'gift', message: "You're my pot of gold! 🏆", emoji: '🎁' },
        { id: 26, x: 20, y: 50, type: 'sparkle', message: "Every storm passes with you by my side! ⛈️", emoji: '✨' },
        { id: 27, x: 80, y: 50, type: 'heart', message: "Our love is pure magic! 🪄", emoji: '💖' },
        { id: 28, x: 10, y: 80, type: 'star', message: "You make my heart soar! 🦅", emoji: '⭐' },
        { id: 29, x: 50, y: 90, type: 'gift', message: "Life is beautiful because of you! 🌺", emoji: '🎀' },
        { id: 30, x: 90, y: 80, type: 'sparkle', message: "Together we shine brighter! 💡", emoji: '💫' },
      ],
      obstacles: [
        { x: 20, y: 35, width: 15, height: 5 },
        { x: 45, y: 25, width: 5, height: 15 },
        { x: 65, y: 35, width: 15, height: 5 },
        { x: 30, y: 60, width: 5, height: 15 },
        { x: 65, y: 60, width: 5, height: 15 },
        { x: 45, y: 75, width: 10, height: 5 },
      ],
      villains: [
        { id: 'v9', startX: 35, startY: 45, path: 'circle', range: 12, speed: 0.025, emoji: '😈' },
        { id: 'v10', startX: 65, startY: 45, path: 'circle', range: 12, speed: 0.025, emoji: '💀' },
        { id: 'v11', startX: 50, startY: 60, path: 'horizontal', range: 35, speed: 0.3, emoji: '👻' },
      ]
    },
    {
      name: "Crystal Caves 💎",
      theme: "from-violet-100 to-fuchsia-100",
      difficulty: "Hard",
      items: [
        { id: 31, x: 15, y: 15, type: 'heart', message: "You're my precious gem! 💎", emoji: '💝' },
        { id: 32, x: 85, y: 15, type: 'star', message: "Our bond is unbreakable! 🔗", emoji: '🌠' },
        { id: 33, x: 50, y: 20, type: 'gift', message: "You're worth more than all the treasures! 👑", emoji: '🎁' },
        { id: 34, x: 15, y: 50, type: 'sparkle', message: "You sparkle brighter than any crystal! ✨", emoji: '💫' },
        { id: 35, x: 85, y: 50, type: 'heart', message: "My heart belongs to you! 🔐", emoji: '💖' },
        { id: 36, x: 30, y: 70, type: 'star', message: "You're my rare find! 🔍", emoji: '⭐' },
        { id: 37, x: 70, y: 70, type: 'gift', message: "Forever grateful for you! 🙏", emoji: '🎀' },
        { id: 38, x: 50, y: 85, type: 'sparkle', message: "You make life shine! 🌟", emoji: '✨' },
      ],
      obstacles: [
        { x: 25, y: 25, width: 8, height: 8 },
        { x: 67, y: 25, width: 8, height: 8 },
        // { x: 35, y: 40, width: 5, height: 20 },
        // { x: 60, y: 40, width: 5, height: 20 },
        // { x: 25, y: 67, width: 8, height: 8 },
        // { x: 67, y: 67, width: 8, height: 8 },
        { x: 46, y: 55, width: 8, height: 8 },
      ],
      villains: [
        { id: 'v12', startX: 30, startY: 35, path: 'vertical', range: 30, speed: 0.05, emoji: '😈' },
        { id: 'v13', startX: 70, startY: 35, path: 'vertical', range: 30, speed: 0.05, emoji: '💀' },
        { id: 'v14', startX: 50, startY: 50, path: 'circle', range: 18, speed: 0.03, emoji: '👻' },
        { id: 'v15', startX: 15, startY: 80, path: 'horizontal', range: 70, speed: 0.03, emoji: '😈' },
      ]
    },
    {
      name: "Enchanted Forest 🌲",
      theme: "from-emerald-100 to-teal-100",
      difficulty: "Hard",
      items: [
        { id: 39, x: 12, y: 12, type: 'heart', message: "You're my natural wonder! 🌿", emoji: '💝' },
        { id: 40, x: 88, y: 12, type: 'star', message: "Growing old with you is my dream! 🌳", emoji: '🌟' },
        { id: 41, x: 50, y: 15, type: 'gift', message: "Our love blooms eternal! 🌸", emoji: '🎁' },
        { id: 42, x: 12, y: 50, type: 'sparkle', message: "You're my breath of fresh air! 🍃", emoji: '✨' },
        { id: 43, x: 88, y: 50, type: 'heart', message: "Nature brought us together! 🦋", emoji: '💖' },
        { id: 44, x: 25, y: 75, type: 'star', message: "You're my sanctuary! 🏡", emoji: '⭐' },
        { id: 45, x: 75, y: 75, type: 'gift', message: "Life with you is paradise! 🌴", emoji: '🎀' },
        { id: 46, x: 50, y: 88, type: 'sparkle', message: "Forever wild about you! 🦊", emoji: '💫' },
        { id: 47, x: 50, y: 50, type: 'heart', message: "You're the heart of my forest! 💚", emoji: '💕' },
      ],
      obstacles: [
        { x: 20, y: 20, width: 5, height: 15 },
        { x: 75, y: 20, width: 5, height: 15 },
        { x: 30, y: 30, width: 10, height: 5 },
        { x: 60, y: 30, width: 10, height: 5 },
        { x: 35, y: 50, width: 5, height: 12 },
        { x: 60, y: 50, width: 5, height: 12 },
        // { x: 20, y: 65, width: 5, height: 15 },
        { x: 75, y: 65, width: 5, height: 15 },
        { x: 43, y: 70, width: 14, height: 5 },
      ],
      villains: [
        { id: 'v16', startX: 25, startY: 40, path: 'circle', range: 10, speed: 0.03, emoji: '😈' },
        { id: 'v17', startX: 75, startY: 40, path: 'circle', range: 10, speed: 0.03, emoji: '💀' },
        { id: 'v18', startX: 50, startY: 30, path: 'horizontal', range: 20, speed: 0.035, emoji: '👻' },
        { id: 'v19', startX: 40, startY: 80, path: 'horizontal', range: 20, speed: 0.03, emoji: '😈' },
      ]
    },
    {
      name: "Heaven's Gate 👼",
      theme: "from-sky-100 to-indigo-100",
      difficulty: "Expert",
      items: [
        { id: 48, x: 10, y: 10, type: 'heart', message: "You're my angel! 👼", emoji: '💝' },
        { id: 49, x: 90, y: 10, type: 'star', message: "Heaven sent you to me! 🙏", emoji: '🌠' },
        { id: 50, x: 50, y: 12, type: 'gift', message: "You're my blessing! ✨", emoji: '🎁' },
        { id: 51, x: 10, y: 30, type: 'sparkle', message: "Flying high with you! 🕊️", emoji: '💫' },
        { id: 52, x: 90, y: 30, type: 'heart', message: "You lift me up! 🎈", emoji: '💖' },
        { id: 53, x: 30, y: 50, type: 'star', message: "Our love is divine! ⛅", emoji: '⭐' },
        { id: 54, x: 70, y: 50, type: 'gift', message: "You're my miracle! 🌟", emoji: '🎀' },
        { id: 55, x: 10, y: 70, type: 'sparkle', message: "Forever in cloud nine! ☁️", emoji: '✨' },
        { id: 56, x: 90, y: 70, type: 'heart', message: "You're heavenly! 🌌", emoji: '💕' },
        { id: 57, x: 50, y: 88, type: 'star', message: "Eternally yours! ♾️", emoji: '🌟' },
      ],
      obstacles: [
        { x: 22, y: 18, width: 6, height: 6 },
        { x: 72, y: 18, width: 6, height: 6 },
        { x: 18, y: 38, width: 6, height: 6 },
        { x: 76, y: 38, width: 6, height: 6 },
        { x: 38, y: 38, width: 8, height: 8 },
        { x: 54, y: 38, width: 8, height: 8 },
        { x: 30, y: 58, width: 6, height: 6 },
        { x: 64, y: 58, width: 6, height: 6 },
        { x: 46, y: 58, width: 8, height: 8 },
        { x: 18, y: 78, width: 6, height: 6 },
        { x: 76, y: 78, width: 6, height: 6 },
        { x: 46, y: 75, width: 8, height: 8 },
      ],
      villains: [
        { id: 'v20', startX: 20, startY: 50, path: 'vertical', range: 40, speed: 0.03, emoji: '😈' },
        { id: 'v21', startX: 80, startY: 50, path: 'vertical', range: 40, speed: 0.03, emoji: '💀' },
        { id: 'v22', startX: 50, startY: 25, path: 'circle', range: 20, speed: 0.03, emoji: '👻' },
        { id: 'v23', startX: 50, startY: 75, path: 'circle', range: 20, speed: 0.04, emoji: '😈' },
        { id: 'v24', startX: 35, startY: 60, path: 'horizontal', range: 30, speed: 0.003, emoji: '💀' },
      ]
    },
  ];

  const currentLevelData = levels[currentLevel];

  // Initialize villains for current level
  useEffect(() => {
    if (gameStarted && !gameOver && !allLevelsComplete) {
      const initialVillains = currentLevelData.villains.map(v => ({
        ...v,
        x: v.startX,
        y: v.startY,
        angle: 0,
      }));
      setVillains(initialVillains);
    }
  }, [currentLevel, gameStarted, gameOver, allLevelsComplete]);

  // Update villain positions
  useEffect(() => {
    if (!gameStarted || gameOver || allLevelsComplete) return;

    const interval = setInterval(() => {
      setVillains(prevVillains =>
        prevVillains.map(villain => {
          let newX = villain.x;
          let newY = villain.y;
          let newAngle = villain.angle;

          if (villain.path === 'horizontal') {
            newX = villain.startX + Math.sin(villain.angle) * villain.range;
            newAngle += villain.speed;
          } else if (villain.path === 'vertical') {
            newY = villain.startY + Math.sin(villain.angle) * villain.range;
            newAngle += villain.speed;
          } else if (villain.path === 'circle') {
            newX = villain.startX + Math.cos(villain.angle) * villain.range;
            newY = villain.startY + Math.sin(villain.angle) * villain.range;
            newAngle += villain.speed;
          }

          return { ...villain, x: newX, y: newY, angle: newAngle };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver, allLevelsComplete]);

  // Check collision with villains
  useEffect(() => {
    if (!gameStarted || gameOver || allLevelsComplete || isInvincible) return;

    const checkVillainCollision = () => {
      villains.forEach(villain => {
        const distance = Math.sqrt(
          Math.pow(character.x - villain.x, 2) + Math.pow(character.y - villain.y, 2)
        );

        if (distance < 6) {
          handleHit();
        }
      });
    };

    checkVillainCollision();
  }, [character, villains, gameStarted, gameOver, allLevelsComplete, isInvincible]);

  const handleHit = () => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameOver(true);
      }
      return newLives;
    });

    setIsInvincible(true);
    setCharacter({ x: 50, y: 50 });

    setTimeout(() => {
      setIsInvincible(false);
    }, 2000);
  };

  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }
      const speed = 2.5;
      moveCharacter(e.key, speed);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, currentLevel]);

  const moveCharacter = (direction: any, speed = 2.5) => {
    setCharacter(prev => {
      let newX = prev.x;
      let newY = prev.y;

      switch (direction) {
        case 'ArrowUp':
        case 'w':
        case 'up':
          newY = Math.max(2, prev.y - speed);
          break;
        case 'ArrowDown':
        case 's':
        case 'down':
          newY = Math.min(98, prev.y + speed);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'left':
          newX = Math.max(2, prev.x - speed);
          break;
        case 'ArrowRight':
        case 'd':
        case 'right':
          newX = Math.min(98, prev.x + speed);
          break;
        default:
          return prev;
      }

      const charSize = 4;
      const collides = currentLevelData.obstacles.some(obs =>
        newX < obs.x + obs.width &&
        newX + charSize > obs.x &&
        newY < obs.y + obs.height &&
        newY + charSize > obs.y
      );

      if (collides) return prev;

      return { x: newX, y: newY };
    });
  };

  const handleTouchStart = (e: any) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: any) => {
    e.preventDefault();
    if (!touchStart.x && !touchStart.y) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    const threshold = 5;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > threshold) {
        moveCharacter('right', 1.5);
      } else if (deltaX < -threshold) {
        moveCharacter('left', 1.5);
      }
    } else {
      if (deltaY > threshold) {
        moveCharacter('down', 1.5);
      } else if (deltaY < -threshold) {
        moveCharacter('up', 1.5);
      }
    }

    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setTouchStart({ x: 0, y: 0 });
  };

  const handleButtonPress = (direction: string) => {
    moveIntervalRef.current = window.setInterval(() => {
      moveCharacter(direction, 2);
    }, 50);
  };

  const handleButtonRelease = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!gameStarted) return;

    const checkCollision = () => {
      currentLevelData.items.forEach(item => {
        if (collected.includes(item.id)) return;

        const distance = Math.sqrt(
          Math.pow(character.x - item.x, 2) + Math.pow(character.y - item.y, 2)
        );

        if (distance < 6) {
          setCollected(prev => [...prev, item.id]);
          setScore(prev => prev + 100);
          setShowMessage(item);
          createParticles(item.x, item.y);

          setTimeout(() => setShowMessage(null), 3000);
        }
      });
    };

    checkCollision();
  }, [character, gameStarted, collected, currentLevel]);

  useEffect(() => {
    const levelItems = currentLevelData.items.map(item => item.id);
    const levelComplete = levelItems.every(id => collected.includes(id));

    if (levelComplete && collected.length > 0) {
      // setLives(prev => prev + 1);
      const timeElapsed = (Date.now() - levelStartTime) / 1000;
      const bonus = Math.max(0, Math.floor((60 - timeElapsed) * 10));
      setTimeBonus(bonus);
      setScore(prev => prev + bonus);

      setTimeout(() => {
        if (currentLevel < levels.length - 1) {
          setCurrentLevel(prev => prev + 1);
          setCharacter({ x: 50, y: 50 });
          setLevelStartTime(Date.now());
        } else {
          setAllLevelsComplete(true);
        }
      }, 2000);
    }
  }, [collected, currentLevel]);

  const createParticles = (x: number, y: number) => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      angle: (Math.PI * 2 * i) / 20,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  const resetGame = () => {
    setCharacter({ x: 50, y: 50 });
    setCollected([]);
    setScore(0);
    setCurrentLevel(0);
    setAllLevelsComplete(false);
    setShowMessage(null);
    setLevelStartTime(Date.now());
    setLives(10);
    setGameOver(false);
    setGameStarted(true);
  };
  // if (isMobile) {
  //   return <DetectSystem />
  // }
  if (gameOver) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center max-w-2xl animate-scale-in">
          <Skull className="mx-auto text-red-500 mb-6" size={100} />
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6">
            Game Over! 💔
          </h1>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-6 md:p-8 mb-8 text-white">
            <p className="text-xl md:text-2xl mb-4 text-blue-500">
              The villains caught you, but our love is stronger than any challenge!
            </p>
            <p className="text-lg mb-4 text-blue-500">
              You reached Level {currentLevel + 1} and collected {collected.length} love messages!
            </p>
            <div className="text-3xl font-bold text-pink-400">
              Score: {score}
            </div>
          </div>
          <button
            onClick={resetGame}
            className="px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xl md:text-2xl font-bold shadow-2xl hover:scale-110 transform transition-all duration-300"
          >
            Try Again! 💝
          </button>
        </div>
      </div>
    );
  }

  if (!gameStarted && !allLevelsComplete) {
    return <GameStart setGameStarted={setGameStarted} />;
  }

  if (allLevelsComplete) {
    const totalMessages = levels.reduce((sum, level) => sum + level.items.length, 0);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-random"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            >
              <Heart className="text-white opacity-20" size={20 + Math.random() * 30} />
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center max-w-4xl animate-scale-in px-4">
          <div className="mb-8">
            <Unlock className="mx-auto text-yellow-300 animate-bounce" size={80} />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-8">
            🎉 QUEST COMPLETE! 🎉
          </h1>
          <div className="bg-white rounded-3xl p-6 md:p-12 shadow-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-6">
              You're My Champion! 👑
            </h2>
            <div className="space-y-4 md:space-y-6 text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed">
              <p className="text-xl md:text-2xl">
                You conquered all 8 levels AND defeated all the villains!
              </p>
              <p className="text-xl md:text-2xl">
                Just like you overcame every challenge in this game,
                you've conquered every piece of my heart. ❤️
              </p>
              <p className="text-base md:text-xl">
                Every obstacle we faced together made us stronger.
                Every villain you dodged showed your determination.
                Every message you collected is a piece of my love for you.
              </p>
              <p className="text-base md:text-xl">
                Thank you for being my player two, my brave hero,
                my partner in every adventure. Together, we're unstoppable! 🎮👫
              </p>
              <div className="text-3xl sm:text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mt-8">
                I LOVE YOU SO MUCH! 💕
              </div>
              <p className="text-2xl md:text-3xl mt-6">
                Happy Valentine's Week! 🌹💝🍫🧸
              </p>
              <div className="mt-8 space-y-4">
                <div className="p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl">
                  <p className="text-2xl md:text-3xl font-bold text-gray-800">
                    🏆 Final Score: {score.toLocaleString()} points!
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
                  <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                    <div className="font-bold text-gray-800">Messages Collected</div>
                    <div className="text-2xl font-bold text-green-600">{totalMessages}/57</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                    <div className="font-bold text-gray-800">Levels Completed</div>
                    <div className="text-2xl font-bold text-blue-600">8/8</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl">
                    <div className="font-bold text-gray-800">Lives Remaining</div>
                    <div className="text-2xl font-bold text-red-600">{lives}/10</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-fuchsia-100 rounded-xl">
                    <div className="font-bold text-gray-800">Villains Defeated</div>
                    <div className="text-2xl font-bold text-purple-600">24 👾</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={resetGame}
            className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-lg md:text-xl font-bold shadow-xl hover:scale-105 transform transition-all"
          >
            Play Again 🎮
          </button>
        </div>
      </div>)
  }

  const levelItemIds = currentLevelData.items.map(item => item.id);
  const levelCollected = collected.filter(id => levelItemIds.includes(id)).length;
  const levelComplete = levelCollected === currentLevelData.items.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-red-200 p-2 sm:p-4 md:p-6">
      {/* ================= HEADER ================= */}
      <div className="max-w-6xl mx-auto mb-2">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-2">

            {/* Level info */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm sm:text-lg md:text-xl font-bold text-pink-600">
                {currentLevelData.name}
              </div>

              <span
                className={`px-2 py-1 rounded-full text-xs font-bold
            ${currentLevelData.difficulty === 'Easy' && 'bg-green-200 text-green-700'}
            ${currentLevelData.difficulty === 'Medium' && 'bg-yellow-200 text-yellow-700'}
            ${currentLevelData.difficulty === 'Hard' && 'bg-orange-200 text-orange-700'}
            ${currentLevelData.difficulty === 'Expert' && 'bg-red-200 text-red-700'}
          `}
              >
                {currentLevelData.difficulty}
              </span>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs sm:text-sm md:text-base">
              <div className="font-semibold">💰 <span className="text-pink-600">{score}</span></div>
              <div className="font-semibold">📍 <span className="text-purple-600">{currentLevel + 1}/8</span></div>
              <div className="font-semibold">💖 <span className="text-purple-600">{levelCollected}/{currentLevelData.items.length}</span></div>

              <div className="flex gap-1">
                {Array.from({ length: lives }).map((_, i) => (
                  <Heart
                    key={i}
                    size={18}
                    className={i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= WARNINGS ================= */}
      {levelComplete && currentLevel < levels.length - 1 && (
        <div className="max-w-6xl mx-auto mb-2">
          <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-xl p-2 text-center text-sm font-bold animate-bounce">
            🎯 Level Complete! +{timeBonus} bonus — next level…
          </div>
        </div>
      )}

      {lives === 1 && (
        <div className="max-w-6xl mx-auto mb-2">
          <div className="bg-gradient-to-r from-red-400 to-orange-400 text-white rounded-xl p-2 text-center text-sm font-bold animate-pulse">
            ⚠️ Last life! Be careful!
          </div>
        </div>
      )}

      {/* ================= GAME AREA ================= */}
      <div className="max-w-3xl mx-auto">
        <div className="max-w-6xl mx-auto">
          <div
            ref={gameRef}
            className={`relative bg-gradient-to-br ${currentLevelData.theme} rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden touch-none ${isInvincible ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}
            style={{ paddingBottom: '75%' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Particles */}
            {particles.map(particle => (
              <div
                key={particle.id}
                className="absolute w-2 h-2 bg-pink-500 rounded-full animate-particle-burst pointer-events-none"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  transform: `translate(-50%, -50%)`,
                }}
              />
            ))}

            {/* Obstacles */}
            {currentLevelData.obstacles.map((obs, i) => (
              <div
                key={i}
                className="absolute bg-pink-400 rounded-lg opacity-70 shadow-md border-2 border-pink-500"
                style={{
                  left: `${obs.x}%`,
                  top: `${obs.y}%`,
                  width: `${obs.width}%`,
                  height: `${obs.height}%`,
                }}
              />
            ))}

            {/* Villains */}
            {villains.map(villain => (
              <div
                key={villain.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100 pointer-events-none z-20"
                style={{
                  left: `${villain.x}%`,
                  top: `${villain.y}%`,
                }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl animate-float filter drop-shadow-lg">
                  {villain.emoji}
                </div>
              </div>
            ))}

            {/* Love Items */}
            {currentLevelData.items.map(item => (
              !collected.includes(item.id) && (
                <div
                  key={item.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-bounce-slow pointer-events-none"
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                  }}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl filter drop-shadow-lg">
                    {item.emoji}
                  </div>
                </div>
              )
            ))}

            {/* Character */}
            <div
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100 z-10 pointer-events-none ${isInvincible ? 'animate-blink' : ''}`}
              style={{
                left: `${character.x}%`,
                top: `${character.y}%`,
              }}
            >
              <div className="text-3xl sm:text-4xl md:text-5xl">
                {isInvincible ? '✨😊✨' : '😊'}
              </div>
            </div>

            {/* Message Popup */}
            {showMessage && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 animate-scale-in px-4 pointer-events-none max-w-[90%]">
                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl">
                  <p className="text-sm sm:text-base md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 text-center">
                    {showMessage.message}
                  </p>
                </div>
              </div>
            )}

            {/* Controls hint for desktop */}
            {!isMobile && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 rounded-full px-4 md:px-6 py-1 md:py-2 text-xs md:text-sm text-gray-700 font-medium">
                Use ← → ↑ ↓ or WASD to move | Avoid villains! 👾
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          {isMobile && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Swipe or use buttons | Avoid villains! 👾</div>
              <div className="flex flex-col items-center gap-2">
                <button
                  onTouchStart={(e) => { e.preventDefault(); handleButtonPress('up'); }}
                  onTouchEnd={(e) => { e.preventDefault(); handleButtonRelease(); }}
                  onMouseDown={() => handleButtonPress('up')}
                  onMouseUp={handleButtonRelease}
                  onMouseLeave={handleButtonRelease}
                  className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-3 sm:p-4 shadow-lg active:bg-pink-200 transition-colors"
                >
                  <ChevronUp size={28} className="text-pink-600" />
                </button>
                <div className="flex gap-2">
                  <button
                    onTouchStart={(e) => { e.preventDefault(); handleButtonPress('left'); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleButtonRelease(); }}
                    onMouseDown={() => handleButtonPress('left')}
                    onMouseUp={handleButtonRelease}
                    onMouseLeave={handleButtonRelease}
                    className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-3 sm:p-4 shadow-lg active:bg-pink-200 transition-colors"
                  >
                    <ChevronLeft size={28} className="text-pink-600" />
                  </button>
                  <button
                    onTouchStart={(e) => { e.preventDefault(); handleButtonPress('down'); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleButtonRelease(); }}
                    onMouseDown={() => handleButtonPress('down')}
                    onMouseUp={handleButtonRelease}
                    onMouseLeave={handleButtonRelease}
                    className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-3 sm:p-4 shadow-lg active:bg-pink-200 transition-colors"
                  >
                    <ChevronDown size={28} className="text-pink-600" />
                  </button>
                  <button
                    onTouchStart={(e) => { e.preventDefault(); handleButtonPress('right'); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleButtonRelease(); }}
                    onMouseDown={() => handleButtonPress('right')}
                    onMouseUp={handleButtonRelease}
                    onMouseLeave={handleButtonRelease}
                    className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-3 sm:p-4 shadow-lg active:bg-pink-200 transition-colors"
                  >
                    <ChevronRight size={28} className="text-pink-600" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Level Progress Bar */}
          <div className="mt-4 flex justify-center gap-1 sm:gap-2">
            {levels.map((level, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div
                  className={`h-2 sm:h-3 w-12 sm:w-16 md:w-20 rounded-full transition-all ${index < currentLevel
                    ? 'bg-green-500 shadow-lg'
                    : index === currentLevel
                      ? 'bg-pink-500 animate-pulse shadow-lg'
                      : 'bg-gray-300'
                    }`}
                />
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {level.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-5px);
          }
        }

        @keyframes float-random {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(-30px) translateX(20px) rotate(90deg);
          }
          50% {
            transform: translateY(-60px) translateX(-20px) rotate(180deg);
          }
          75% {
            transform: translateY(-30px) translateX(20px) rotate(270deg);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-10px) scale(1.1);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes particle-burst {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(3) translateY(-50px);
          }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .animate-float {
          animation: float 2s ease-in-out infinite;
        }

        .animate-float-random {
          animation: float-random ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-particle-burst {
          animation: particle-burst 1s ease-out forwards;
        }

        .animate-blink {
          animation: blink 0.3s ease-in-out infinite;
        }
      `}</style>
    </div >
  );
}