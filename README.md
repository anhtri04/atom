# Agentic Trading Desktop App — Brief Overview

The **Agentic Trading Desktop App** is a professional investment workspace that helps investors research markets, analyze stocks, manage portfolios, and make better-informed decisions with the support of an AI-powered Trading Assistant Workflow.

Instead of being just a stock dashboard or chatbot, the app combines **market data, charts, screeners, research notes, portfolio insights, and assistant-driven analysis** into one unified desktop workspace.

---

## Core Idea

The app works like an **IDE for investors**.

In a software IDE, developers use panels like file explorer, editor, terminal, debugger, and logs.
In this trading app, investors use panels like watchlist, chart, screener, news, fundamentals, portfolio, notes, and AI assistant.

The goal is to help users move through the full investing workflow:

```txt
Discover → Analyze → Research → Decide → Monitor → Review
```

---

## Main Value Proposition

The app provides investors with a structured workspace where every panel can collaborate with the AI Trading Assistant.

The assistant does not simply answer from general knowledge. It can use market data tools, read the current workspace context, analyze selected stocks, inspect technical indicators, compare fundamentals, review news, summarize research notes, and explain its reasoning with evidence.

This makes the product feel like:

> A professional investing workspace powered by an intelligent trading assistant.

Not just:

> A chatbot that talks about stocks.

---

## Key Features

### Market Data Workspace

The app provides access to real-time or delayed market data, including:

* stock quotes
* historical OHLCV candles
* market indexes
* sector performance
* volume data
* corporate actions
* fundamentals
* news and events

This market data becomes the truth layer for both the user interface and the assistant workflow.

---

### Multi-Panel Desktop Interface

The app is organized into multiple panels, each serving a specific investing function.

Core panels include:

* **Market Overview** — shows index movement, sector strength, market breadth, top gainers, and top losers.
* **Watchlist** — lets users track selected stocks and quickly switch workspace context.
* **Chart Panel** — displays candlestick charts, volume, indicators, and technical analysis.
* **Stock Detail Panel** — shows company profile, latest price, exchange, sector, and key metrics.
* **Screener Panel** — helps users discover stocks based on technical and fundamental filters.
* **News & Events Panel** — shows market news, company news, earnings, dividends, and important events.
* **Research Notes Panel** — allows users to write investment theses, trading plans, and review notes.
* **Portfolio Panel** — helps users track holdings, allocation, profit/loss, and exposure.
* **Data Health Panel** — shows sync status, stale data warnings, and provider reliability.
* **Trading Assistant Panel** — provides AI-assisted analysis, planning, explanation, and workflow execution.

---

## Trading Assistant Workflow

The Trading Assistant is the main differentiator of the app.

It can help users with tasks such as:

* analyzing a selected stock
* explaining price movement
* comparing multiple stocks
* finding opportunities with screeners
* checking whether a stock matches a trading setup
* summarizing news impact
* reviewing portfolio risk
* generating investment theses
* suggesting alerts
* explaining technical signals
* turning natural language requests into structured analysis workflows

Example:

```txt
User: Analyze FPT for swing trading.

Assistant workflow:
1. Load latest quote
2. Load 1-year daily candles
3. Calculate MA20, MA50, RSI, MACD
4. Compare FPT with VNINDEX
5. Check recent news
6. Review volume behavior
7. Generate trading thesis, risks, and possible levels
```

The assistant should show not only the final answer, but also:

* what data it used
* what tools it called
* what assumptions it made
* what risks or data limitations exist

This creates transparency and trust.

---

## Shared Workspace Context

All panels in the app share the same workspace context.

For example, when the user selects `FPT` from the watchlist:

* the chart updates to FPT
* the stock detail panel shows FPT
* the news panel filters FPT news
* the fundamentals panel loads FPT metrics
* the notes panel opens the FPT research note
* the assistant understands that FPT is the current focus

This creates a smooth workflow where the user does not need to repeatedly explain context to the assistant.

