import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Modules',
    group: true,
  },
  {
    title: 'Gestion des agents',
    icon: 'people-outline',
    children: [
      {
        title: 'Liste des agents',
        link: '/pages/listUser',
      },
      {
        title: 'Agents disponibles',
        link: '/pages/agentsdisponibles',
      },{
        title: 'Calendrier',
        link: '/pages/agentScheduler',
      }
    ],
  },
  {
    title: 'Gestion des rondes',
    icon: 'map-outline',
    children: [
      {
        title: 'Création des rondes',
        link: '/pages/gestionronde',
      },
      {
        title: 'Liste des rondes',
        link: '/pages/listRonde',
      }
    ],
  },
  {
    title: 'Gestion des événements',
    icon: 'bell-outline',
    children: [
      {
        title: 'Affectation des événements',
        link: '/pages/gestionevents',
      },
      {
        title: 'Liste des événements',
        link: '/pages/listeEvenement',
      }
    ],
  },
  /*
  {
    title: 'Charts',
    icon: 'pie-chart-outline',
    children: [
      {
        title: 'Echarts',
        link: '/pages/charts/echarts',
      },
      {
        title: 'Charts.js',
        link: '/pages/charts/chartjs',
      },
      {
        title: 'D3',
        link: '/pages/charts/d3',
      },
    ],
  },*/
  {
    title: 'Statitiques',
    icon: 'pie-chart-outline',
    link:'/pages/statistique'
  }
];
