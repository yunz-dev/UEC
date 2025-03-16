#!/bin/bash
# Start both processes

npm start &
sudo cloudflared service install "$TUNNEL_TOKEN" &

# Wait for background processes to finish
wait
