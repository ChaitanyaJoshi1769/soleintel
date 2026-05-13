-- Add Price Prediction table (if not already exists from schema)
CREATE TABLE IF NOT EXISTS "PricePrediction" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "predictionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "prediction7days" DOUBLE PRECISION NOT NULL,
  "prediction14days" DOUBLE PRECISION NOT NULL,
  "prediction30days" DOUBLE PRECISION NOT NULL,
  "confidence7days" DOUBLE PRECISION NOT NULL,
  "confidence14days" DOUBLE PRECISION NOT NULL,
  "confidence30days" DOUBLE PRECISION NOT NULL,
  "recommendation" TEXT NOT NULL,
  "actual7daysPrice" DOUBLE PRECISION,
  "actual14daysPrice" DOUBLE PRECISION,
  "actual30daysPrice" DOUBLE PRECISION,
  "accuracy" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PricePrediction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE
);

-- Add Model Metrics table (if not already exists from schema)
CREATE TABLE IF NOT EXISTS "ModelMetrics" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "trainingDate" TIMESTAMP(3) NOT NULL,
  "totalProductsTrained" INTEGER NOT NULL,
  "mae" DOUBLE PRECISION NOT NULL,
  "rmse" DOUBLE PRECISION NOT NULL,
  "accuracy" DOUBLE PRECISION NOT NULL,
  "version" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Shared Watchlist table
CREATE TABLE "SharedWatchlist" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "originalWatchlistId" TEXT NOT NULL,
  "ownerUserId" TEXT NOT NULL,
  "shareToken" TEXT NOT NULL UNIQUE,
  "permissions" TEXT NOT NULL DEFAULT '["view"]',
  "expiresAt" TIMESTAMP(3),
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  "lastAccessedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SharedWatchlist_originalWatchlistId_fkey" FOREIGN KEY ("originalWatchlistId") REFERENCES "Watchlist" ("id") ON DELETE CASCADE,
  CONSTRAINT "SharedWatchlist_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Create Community Deal table
CREATE TABLE "CommunityDeal" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "authorId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "retailerId" TEXT,
  "dealPrice" DOUBLE PRECISION NOT NULL,
  "originalPrice" DOUBLE PRECISION NOT NULL,
  "description" TEXT,
  "upvotes" INTEGER NOT NULL DEFAULT 0,
  "downvotes" INTEGER NOT NULL DEFAULT 0,
  "commentCount" INTEGER NOT NULL DEFAULT 0,
  "savingsPercentage" DOUBLE PRECISION NOT NULL,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CommunityDeal_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE,
  CONSTRAINT "CommunityDeal_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE
);

-- Create Achievement table
CREATE TABLE "Achievement" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "achievementType" TEXT NOT NULL,
  "achievementName" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "icon" TEXT NOT NULL,
  "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Create Referral table
CREATE TABLE "Referral" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "referrerId" TEXT NOT NULL,
  "referralCode" TEXT NOT NULL UNIQUE,
  "referredUserCount" INTEGER NOT NULL DEFAULT 0,
  "totalEarned" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rewardPerReferral" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Create Referral History table (track which users were referred by whom)
CREATE TABLE "ReferralHistory" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "referralId" TEXT NOT NULL,
  "referredUserId" TEXT NOT NULL,
  "rewardAmount" DOUBLE PRECISION NOT NULL,
  "rewardStatus" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReferralHistory_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "Referral" ("id") ON DELETE CASCADE,
  CONSTRAINT "ReferralHistory_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Create Leaderboard Entry table
CREATE TABLE "LeaderboardEntry" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "period" TEXT NOT NULL,
  "totalSavings" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "dealsFound" INTEGER NOT NULL DEFAULT 0,
  "avgSavingsPerDeal" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rank" INTEGER,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LeaderboardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Create Indexes for performance
CREATE INDEX "PricePrediction_productId_idx" ON "PricePrediction"("productId");
CREATE INDEX "PricePrediction_predictionDate_idx" ON "PricePrediction"("predictionDate");
CREATE INDEX "SharedWatchlist_ownerUserId_idx" ON "SharedWatchlist"("ownerUserId");
CREATE INDEX "SharedWatchlist_shareToken_idx" ON "SharedWatchlist"("shareToken");
CREATE INDEX "SharedWatchlist_expiresAt_idx" ON "SharedWatchlist"("expiresAt");
CREATE INDEX "CommunityDeal_authorId_idx" ON "CommunityDeal"("authorId");
CREATE INDEX "CommunityDeal_productId_idx" ON "CommunityDeal"("productId");
CREATE INDEX "CommunityDeal_createdAt_idx" ON "CommunityDeal"("createdAt");
CREATE INDEX "CommunityDeal_featured_idx" ON "CommunityDeal"("featured");
CREATE INDEX "Achievement_userId_idx" ON "Achievement"("userId");
CREATE INDEX "Achievement_achievementType_idx" ON "Achievement"("achievementType");
CREATE INDEX "Referral_referralCode_idx" ON "Referral"("referralCode");
CREATE INDEX "Referral_referrerId_idx" ON "Referral"("referrerId");
CREATE INDEX "ReferralHistory_referralId_idx" ON "ReferralHistory"("referralId");
CREATE INDEX "ReferralHistory_referredUserId_idx" ON "ReferralHistory"("referredUserId");
CREATE INDEX "LeaderboardEntry_userId_idx" ON "LeaderboardEntry"("userId");
CREATE INDEX "LeaderboardEntry_period_idx" ON "LeaderboardEntry"("period");
