import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

export const BurgerIngredients: FC = () => {
  /** TODO: взять переменные из стора */
  // const buns = [];
  // const mains = [];
  // const sauces = [];

  // Временные тестовые данные
  const buns = [
    {
      _id: '1',
      name: 'Булочка классическая',
      type: 'bun',
      price: 50,
      image: '/bun.png',
      image_mobile: '/bun_mobile.png',
      image_large: '/bun_large.png',
      proteins: 10,
      fat: 8,
      carbohydrates: 40,
      calories: 250
    }
  ];
  const mains = [
    {
      _id: '3',
      name: 'Котлета говяжья',
      type: 'main',
      price: 100,
      image: '/beef.png',
      image_mobile: '/beef_mobile.png',
      image_large: '/beef_large.png',
      proteins: 20,
      fat: 15,
      carbohydrates: 0,
      calories: 220
    }
  ];
  const sauces = [
    {
      _id: '5',
      name: 'Соус барбекю',
      type: 'sauce',
      price: 30,
      image: '/bbq.png',
      image_mobile: '/bbq_mobile.png',
      image_large: '/bbq_large.png',
      proteins: 1,
      fat: 10,
      carbohydrates: 20,
      calories: 130
    }
  ];

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  // было
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // с

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
