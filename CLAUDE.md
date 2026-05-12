# BotVault — Contesto Progetto

## Stack attuale

- **Frontend (PWA)**: React + Tailwind, tema dark premium oro/nero, deployata su Vercel (`cryptodesk-rust.vercel.app`)
- **Trading bot**: Python, monitoraggio SOL/EUR ogni 60s con RSI + MACD, deployato su Railway
- **Exchange**: Kraken
- **Repo**: `cryptodesk` (Vercel) e `trading-bot` (Railway) su GitHub

## Logica bot

- Strategia: RSI + MACD su SOL/EUR, intervallo 60 secondi
- Take Profit: +4% e +8%
- Stop Loss: -5%
- Acquisti automatici

## PWA features

- Portfolio overview
- Equity curve
- Prezzi live
- Tema dark oro/nero premium

## Marketing

- 6 slide PNG per TikTok in `~/cryptodesk_slides/` (stile minimal bianco/blu, risultati reali +2,17% in 3 giorni)

## Brand Identity

- **Nome**: BotVault
- **Logo**: Vault door minimal geometrico, blu #1a56ff su sfondo bianco/blu
- **Palette**: Blu #1a56ff / Bianco / Nero #0a0a0a
- **Tagline**: "Il bot che lavora mentre tu dormi."
- **Bio social**: "Trading bot automatico su Kraken | SOL/EUR 24/7 | Risultati reali"
- **Handle social**: @botvault (TikTok, Instagram)
- **Dominio target**: botvault.app / botvault.trade

## Roadmap

1. Pubblicare video TikTok + piano premium/donazione per accesso alla piattaforma
2. Trasformare BotVault in SaaS multi-utente (login, DB, bot separato per utente)
3. Aggiungere modifica parametri bot (TP/SL) direttamente dalla PWA
4. Espandere a più coin al crescere del capitale
