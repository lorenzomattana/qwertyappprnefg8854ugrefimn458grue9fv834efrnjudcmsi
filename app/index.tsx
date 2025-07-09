@@ .. @@
           <GameHUD
             cash={gameState.cash}
             xp={gameState.xp}
+            level={Math.floor(gameState.xp / 1000) + 1}
             currentCity={gameState.currentCity}
             currentCar={gameState.currentCar}
           />