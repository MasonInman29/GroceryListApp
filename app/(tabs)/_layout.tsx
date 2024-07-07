// // app/(tabs)/_layout.tsx
// import React, { useEffect } from 'react';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { Link, Tabs } from 'expo-router';
// import { Pressable } from 'react-native';

// import Colors from '@/constants/Colors';
// import { useColorScheme } from '@/components/useColorScheme';
// import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import DashboardScreen from './DashboardScreen';
// import GroceryListScreen from './GroceryListScreen';
// import ManageGroceryList from './ManageGroceryList';
// import { GroceryListProvider } from './context/GroceryListContext'; // Adjust path as necessary
// import * as SplashScreen from 'expo-splash-screen';
// import { useFonts } from 'expo-font';
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

// const Tab = createBottomTabNavigator();

// export default function Layout() {
//   const colorScheme = useColorScheme();

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       {/* <NavigationContainer> */}
//         <GroceryListProvider>
//           <Tab.Navigator>
//             <Tab.Screen name="Dashboard" component={DashboardScreen} />
//             <Tab.Screen name="My List" component={GroceryListScreen} />
//             <Tab.Screen name="Manage" component={ManageGroceryList} />
//           </Tab.Navigator>
//         </GroceryListProvider>
//       {/* </NavigationContainer> */}
//     </ThemeProvider>
//   );
// }

import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { GroceryListProvider } from './context/GroceryListContext';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GroceryListProvider>
      
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
        <Tabs.Screen
          name="GroceryListScreen"
          options={{
            title: 'My List',
            tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
          }}
          />
      <Tabs.Screen
        name="PriceFinderScreen"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
        />
    </Tabs>
      </GroceryListProvider>
  );
}
