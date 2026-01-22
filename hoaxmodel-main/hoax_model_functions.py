'''
# 5. The Hoax model

In the following, we implement and execute the hoax model as defined in the following 
papers.

## References

Tambuscio, M., Ruffo, G., Flammini, A.,& Menczer, F. (2015). 
Fact-checking effect on viral hoaxes: A model of misinformation spread in social networks. 
In Proceedings of the 24th International Conference on World Wide Web Companion (pp. 977–982). 

Tambuscio, M., Oliveira, D.F.M., Ciampaglia, G.L. et al. 
Network segregation in a model of misinformation and fact-checking. 
J Comput Soc Sc 1, 261–275 (2018). https://doi.org/10.1007/s42001-018-0018-9

Tambuscio, M., Ruffo, G. 
Fact-checking strategies to limit urban legends spreading in a segregated society. 
Appl Netw Sci 4, 116 (2019). https://doi.org/10.1007/s41109-019-0233-1
'''
import networkx as nx
import random
from hoax_config import HoaxConfig
"""
def configure_hoax_model(alpha=0.2, beta=0.5, p_v=0.05, p_f=0.05, perc_believers=0.05, perc_factcheckers=0.05):
    '''
    Configure the parameters for the hoax model.

    Args:
        alpha: Influence of belief on the spread of hoaxes
        beta: Probability of spreading a hoax
        p_v: Probability of verifying a hoax
        p_f: Probability of forgetting a hoax
        perc_believers: Initial proportion of believers
        perc_factcheckers: Initial proportion of fact-checkers
    '''
    global ALPHA, BETA, P_V, P_F
    ALPHA = alpha
    BETA = beta
    P_V = p_v
    P_F = p_f

    global PERC_BELIEVERS, PERC_FACTCHECKERS
    PERC_BELIEVERS = perc_believers
    PERC_FACTCHECKERS = perc_factcheckers
"""
"""
### 5.1 Initial state
In the hoax model, each node can be in one of three states:

- **S**: Susceptible (not yet exposed to the hoax)
- **B**: Believer (believes and may spread the hoax)
- **FC**: Fact-checker (actively debunks the hoax)

The initial state is typically set by assigning all nodes to the susceptible state, 
and then randomly selecting a small number of nodes to start as believers and/or 
fact-checkers. This setup allows us to observe how misinformation and fact-checking 
spread through the network.
"""

def hoax_initial_state(G: nx.Graph, config: HoaxConfig):
    state = {}
    nodes = list(G.nodes)
    n = len(nodes)
    n_believers = max(1, int(config.perc_believers * n))
    n_factcheckers = max(0, int(config.perc_factcheckers * n))

    # Randomly select believers and fact-checkers
    selected = random.sample(nodes, n_believers + n_factcheckers)
    believers = set(selected[:n_believers])
    factcheckers = set(selected[n_believers:])

    for node in nodes:
        if node in believers:
            state[node] = 'B'
        elif node in factcheckers:
            state[node] = 'FC'
        else:
            state[node] = 'S'

    return state

'''
### 5.2 State transition

The hoax model involves four parameters, 
$\alpha$ is the credibility of the hoax,  
$\beta$ is the spreading rate, 
$p_v$ the verifying probability, 
and $p_f$ is the forgetting probability.  
Given a node $i$, the number of neighbors of $i$ are $n_i$. 
The probability of transact from $S$ to $B$ is equal to $f_i(t) = \beta\,\frac{{n_i^B(t)}(1 + \alpha)}{{n_i^B(t)}(1 + \alpha) + {n_i^F(t)}(1 - \alpha)}$, 
and the probability of transact from $S$ to $FC$ is $g_i(t) = \beta\,\frac{{n_i^F(t)}(1 - \alpha)}{{n_i^B(t)}(1 + \alpha) + {n_i^F(t)}(1 - \alpha)}$. 
The probability of transact from $B$ to $FC$ is equal to $p_v$, 
and the probability of transact from $B$ or from $FC$ to $S$ is equal to $p_f$ 

In pseudocode, the algorithm looks like this:
- For each node $i$ in the graph:
  - If node $i$ is in state **S**:
    - Let $n_i^B$ = number of neighbors in state **B**
    - Let $n_i^F$ = number of neighbors in state **FC**
    - Compute $Z = n_i^B \cdot (1 + \alpha) + n_i^F \cdot (1 - \alpha)$
    - If $Z > 0$:
      - Compute $f_i = \beta \cdot \frac{n_i^B \cdot (1 + \alpha)}{Z}$
      - Compute $g_i = \beta \cdot \frac{n_i^F \cdot (1 - \alpha)}{Z}$
      - With probability $f_i$, set next state to **B**
      - Else, with probability $g_i$, set next state to **FC**
      - Else, remain in **S**
    - Else:
      - Remain in **S**
  - Else if node $i$ is in state **B**:
    - With probability $p_v$, set next state to **FC**
    - Else, with probability $p_f$, set next state to **S**
    - Else, remain in **B**
  - Else if node $i$ is in state **FC**:
    - With probability $p_f$, set next state to **S**
    - Else, remain in **FC**
'''

def hoax_state_transition(G: nx.Graph, current_state: list, config: HoaxConfig):

    '''
    gullibility = []
    if config.clustered and type(config.alpha) is dict and set(config.alpha.keys()) == {'sk', 'gu'}:
        gullibility = [config.alpha['sk'] if node in G.graph['partition'][0] else config.alpha['gu'] for node in G.nodes]
    elif config.clustered and type(config.alpha) is not float:
        raise ValueError("For clustered graphs, ALPHA must be a float or a dict with keys 'sk' and 'gu'.")
    elif type(config.alpha) is list and len(config.alpha) == config.num_nodes:
        gullibility = [config.alpha for _ in range(config.num_nodes)]
    else:
        gullibility = [config.alpha for _ in range(config.num_nodes)]
    '''
    gullibility = [v for v in nx.get_node_attributes(G, 'gullibility').values()]



    next_state = {}
    for node in G.nodes:

        state = current_state[node]
        neighbors = list(G.neighbors(node))
        nB = sum(1 for n in neighbors if current_state[n] == 'B')
        nF = sum(1 for n in neighbors if current_state[n] == 'FC')
        Z = nB * (1 + gullibility[node]) + nF * (1 - gullibility[node])

        if state == 'S':
            if Z > 0:
                f_i = config.beta * (nB * (1 + gullibility[node])) / Z
                g_i = config.beta * (nF * (1 - gullibility[node])) / Z
                r = random.random()
                if r < f_i:
                    next_state[node] = 'B'
                elif r < f_i + g_i:
                    next_state[node] = 'FC'
                # else remain 'S'
            # else remain 'S'
        elif state == 'B':
            r = random.random()
            new_p_v = 1 - gullibility[node]
            if r < new_p_v:
                next_state[node] = 'FC'
            elif r < new_p_v + config.p_f:
                next_state[node] = 'S'
            # else remain 'B'
        elif state == 'FC':
            if random.random() < config.p_f:
                next_state[node] = 'S'
            # else remain 'FC'
    return next_state

def stop_condition(G: nx.Graph, current_state: list):
    unique_state_values = set(current_state.values())
    is_stopped = len(unique_state_values) <= 1 or ('B' not in unique_state_values)
    return is_stopped
