import { useEffect, useState } from 'react';
import { getInitialTheme, setTheme, type Theme } from '../utils/theme';

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  const toggle = () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));
  const isDark = theme === 'dark';

  return (
    <button
      className="btn btn-outline btn-sm"
      onClick={toggle}
      title={isDark ? 'Светлая тема' : 'Тёмная тема'}
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
