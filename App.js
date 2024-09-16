import {useState,useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import CamView from './Component/CamView';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function App() {

async function loadAsset (){
  try {
    await Font.loadAsync({
        "impacted":require('./assets/fonts/impacted.ttf'),
      })
  } catch (error) {
    console.log(error)
  }
}

useEffect(()=>{
  loadAsset().then(async ()=>{
    await SplashScreen.hideAsync();
  })  
},[]) 

  return (
    <CamView/>
  );
}
