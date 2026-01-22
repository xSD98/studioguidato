import imageio
import networkx as nx
import numpy as np
import os
import matplotlib.pyplot as plt
from hoax_config import HoaxConfig
import pandas as pd

# define a function to create either an Erdős-Rényi 
# or a clustered graph based on the configuration
def create_graph(config: HoaxConfig, save=False, realization_number=None) -> nx.Graph:
    p_avg = config.average_degree / (config.num_nodes - 1)
    if config.clustered:
        s = config.p_seg  # segregation parameter
        num_nodes = config.num_nodes
        if not 0.5 <= s <= 1.0:
            raise ValueError("Segregation parameter 's' must be between 0.5 and 1.0.")

        # Calculate intra-cluster (p_in) and inter-cluster (p_out) probabilities
        p_in = p_avg + 2 * p_avg * (s - 0.5)
        p_out = p_avg - 2 * p_avg * (s - 0.5)
        
        # Ensure probabilities are within the [0, 1] range
        p_in = max(0.0, min(1.0, p_in))
        p_out = max(0.0, min(1.0, p_out))

        # Define cluster sizes (assuming two equal clusters)
        size_a = num_nodes // 2
        size_b = num_nodes - size_a
        sizes = [size_a, size_b]

        # Define the probability matrix P
        # P[i, j] is the probability of an edge between nodes in cluster i and cluster j
        P = [[p_in, p_out], [p_out, p_in]]
        if config.verbose:
            print(f"s={s:.2f} -> P_in={p_in:.4f}, P_out={p_out:.4f}")
            
        # Generate the graph
        G = nx.stochastic_block_model(sizes, P, seed=42)
    else: 
        G = nx.erdos_renyi_graph(config.num_nodes, p_avg)

    # initialize nodes' gullibility attribute if needed
    gullibility = []
    if config.clustered and type(config.alpha) is dict and set(config.alpha.keys()) == {'sk', 'gu'}:
        gullibility = [config.alpha['sk'] if node in G.graph['partition'][0] else config.alpha['gu'] for node in G.nodes]
    elif config.clustered and type(config.alpha) is not float:
        raise ValueError("For clustered graphs, ALPHA must be a float or a dict with keys 'sk' and 'gu'.")
    elif type(config.alpha) is list and len(config.alpha) == config.num_nodes:
        gullibility = [config.alpha for _ in range(config.num_nodes)]
    else:
        gullibility = [config.alpha for _ in range(config.num_nodes)]
    nx.set_node_attributes(G, {node: gullibility[node] for node in G.nodes}, 'gullibility')

    if save:
        dt_str = config.dt_str
        if realization_number:
            dt_str += f"_{str(realization_number)}"
        filename = f"graphs/{dt_str}_graph.gexf"
        nx.write_gexf(G, filename)
    return G

# define a function to plot and save simulation results as an 
# animated gif
def plot_and_save_animated_sim(config: HoaxConfig, sim, realization_number=None) -> None:
    """
    Plot and save an animated simulation of the hoax model.
    """
    # Ensure the 'plots' directory exists
    os.makedirs('animated_gifs', exist_ok=True)

    # Generate a filename with datetime and the realization number
    dt_str = config.dt_str
    if realization_number:
        dt_str += f"_{str(realization_number)}"
    filename = f"animated_gifs/{dt_str}_hoax_model_simulation.gif"

    # Create an animated GIF of the simulation steps
    images = []
    for step in range(sim.steps + 1):
        # sim._pos = nx.forceatlas2_layout(sim.G)
        sim.draw(step)
        plt.title(f"Step {step}")
        tmp_fn = f"step_{step}.png"
        plt.savefig(tmp_fn)
        plt.close()
        images.append(imageio.imread(tmp_fn))
        os.remove(tmp_fn)
    imageio.mimsave(filename, images, duration=0.5)
    print(f"Animated simulation saved to {filename}")
    
# define a function to plot and save simulation results
def plot_and_save_sim_results(config: HoaxConfig, sim, realization_number=None) -> None:
    """
    Plot and save the final state of the hoax model simulation.
    """
    # Ensure the 'plots' directory exists
    os.makedirs('plots', exist_ok=True)

    # Generate a filename with datetime and the realization number
    dt_str = config.dt_str
    if realization_number:
        dt_str += f"_{str(realization_number)}"
    filename = f"plots/{dt_str}_hoax_model_simulation.png"

    # Create an animated GIF of the simulation steps
    #sim.draw(sim.steps, state_colors=config.state_colors)
    plt.title(f"Hoax Model Simulation at Step {sim.steps}")
    sim.plot()
    plt.savefig(filename)
    plt.show()
    plt.close()
    print(f" plot saved to {filename}")

# define a function to compute mean and std deviation across realizations
def compute_statistics(counts_list: list) -> tuple:
    """
    Compute mean and standard deviation for each state across realizations.
    """

    believers_arrays = [item[0] for item in counts_list]
    factcheckers_arrays = [item[1] for item in counts_list]
    susceptibles_arrays = [item[2] for item in counts_list]
    
    # Example shape: (num_runs, num_timesteps)
    stacked_believers = np.stack(believers_arrays, axis=0)
    stacked_factcheckers = np.stack(factcheckers_arrays, axis=0)
    stacked_susceptibles = np.stack(susceptibles_arrays, axis=0)

    # 3. Calculate the mean and standard deviation along the simulation axis (axis=0)
    
    # Believers
    mean_believers = np.mean(stacked_believers, axis=0)
    std_believers = np.std(stacked_believers, axis=0)

    # Fact-checkers
    mean_factcheckers = np.mean(stacked_factcheckers, axis=0)
    std_factcheckers = np.std(stacked_factcheckers, axis=0)

    # Susceptibles
    mean_susceptibles = np.mean(stacked_susceptibles, axis=0)
    std_susceptibles = np.std(stacked_susceptibles, axis=0)
    
    return (
        mean_believers, std_believers, 
        mean_factcheckers, std_factcheckers, 
        mean_susceptibles, std_susceptibles
    )

# define a function to plot and save statistics
def plot_and_save_statistics(statistics, counts_list,
                             config: HoaxConfig) -> None:
    """
    Plot mean and std deviation of states over realizations and save results.
    """
    (mean_believers, std_believers,
     mean_factcheckers, std_factcheckers,
     mean_susceptibles, std_susceptibles) = statistics  

    # Plot mean curves with shaded std
    x = np.arange(config.steps + 1)
    plt.figure(figsize=(10, 6))
    plt.plot(x, mean_believers, label='Believers', color=config.state_colors.get('B', '#377eb8'))
    plt.fill_between(x, mean_believers - std_believers, mean_believers + std_believers, color=config.state_colors.get('B', '#377eb8'), alpha=0.2)
    plt.plot(x, mean_factcheckers, label='Fact-checkers', color=config.state_colors.get('FC', '#e41a1c'))
    plt.fill_between(x, mean_factcheckers - std_factcheckers, mean_factcheckers + std_factcheckers, color=config.state_colors.get('FC', '#e41a1c'), alpha=0.2)
    plt.plot(x, mean_susceptibles, label='Susceptibles', color=config.state_colors.get('S', '#cccccc'))
    plt.fill_between(x, mean_susceptibles - std_susceptibles, mean_susceptibles + std_susceptibles, color=config.state_colors.get('S', '#cccccc'), alpha=0.2)
    plt.xlabel('Step')
    plt.ylabel('Number of nodes')
    plt.title('Hoax Model: Mean and Std of States over Realizations')
    plt.legend()
    plt.tight_layout()
    fig1 = plt.gcf()
    plt.show()

    # Generate a filename with datetime
    dt_str = config.dt_str
    plot_filename = f"plots/{dt_str}_hoax_model_realizations.png"

    fig1.savefig(plot_filename)
    print(f"Plot saved to {plot_filename}")
    plt.close()

    # Save the configuration parameters, the counts, and the predictions of the number of believers vanishing at equilibrium in a text file
    config.write_to_file()

    with open(f'data/{dt_str}_realizations_result.txt', 'w') as f:
        f.write("Final counts for each realization and step:\n")
        for i in range(config.num_realizations):
            (believers_counts, factcheckers_counts, susceptibles_counts) = counts_list[i]
            f.write(f"Realization {i+1}:\n")
            f.write(f"Believers: {believers_counts.tolist()}\n")
            f.write(f"Fact-checkers: {factcheckers_counts.tolist()}\n")
            f.write(f"Susceptibles: {susceptibles_counts.tolist()}\n\n")
        f.write("Mean and standard deviation of counts over realizations:\n")
        f.write(f"Mean Believers: {mean_believers.tolist()}\n")
        f.write(f"Std Believers: {std_believers.tolist()}\n")
        f.write(f"Mean Fact-checkers: {mean_factcheckers.tolist()}\n")
        f.write(f"Std Fact-checkers: {std_factcheckers.tolist()}\n")
        f.write(f"Mean Susceptibles: {mean_susceptibles.tolist()}\n")
        f.write(f"Std Susceptibles: {std_susceptibles.tolist()}\n")

    # Print summary statistics for final step
    if config.verbose:
        print("Final step statistics:")
        print(f"Believers: mean={mean_believers[-1]:.2f}, std={std_believers[-1]:.2f}, min={np.min(believers_counts)}, max={np.max(believers_counts)}")
        print(f"Fact-checkers: mean={mean_factcheckers[-1]:.2f}, std={std_factcheckers[-1]:.2f}, min={np.min(factcheckers_counts)}, max={np.max(factcheckers_counts)}")
        print(f"Susceptibles: mean={mean_susceptibles[-1]:.2f}, std={std_susceptibles[-1]:.2f}, min={np.min(susceptibles_counts)}, max={np.max(susceptibles_counts)}")

# define a function to plot phase diagram to show how the number of 
# believers at equilibrium (Z values) change according the general configuration
# and variable values of the segregation parameter the gullibility probability
def plot_phase_diagram(s_values, alpha_values, Z, config: HoaxConfig):
    """
    Plot the phase diagram (heatmap) of the hoax model results.
    """
    plt.figure(figsize=(10, 8))

    # value range for color mapping as the minimum and maximum of Z
    vmin, vmax = np.min(Z), np.max(Z)

    # extract s_min, s_max, alpha_min, alpha_max from the ranges defined earlier
    s_min, s_max = s_values[0], s_values[-1]
    alpha_min, alpha_max = alpha_values[0], alpha_values[-1]

    # Use imshow to create the heatmap
    im = plt.imshow(
        Z,
        interpolation='none',
        cmap='Greens',  # Gradient of green
        aspect='auto',
        origin='lower',
        extent=[s_min, s_max, alpha_min, alpha_max],
        vmin=0, vmax=500
    )
    # add a colorbar
    cbar = plt.colorbar(im, label=r'$B_\infty$')

    plt.xlabel('Segregation Probability (s)')
    plt.ylabel(r'Gullibility of the Gullible Group ($\alpha_{gu}$)')
    plt.title(f"Phase Diagram of Hoax Model: Final Number of Believers when $p_f$={config.p_f}, $\\alpha_{{sk}}$={config.alpha['sk']}")
    

    # Generate a filename with datetime
    dt_str = config.dt_str
    filename = f"phase_diagrams/{dt_str}_phase_diagram.png"
    
    # Save the figure
    plt.savefig(filename, bbox_inches='tight', pad_inches=0)
    print(f"Phase diagram saved as {filename}")

    # Save the configuration parameters, the counts, and the predictions of the number of believers vanishing at equilibrium in a text file
    config.write_to_file()
    
    # 1. Create a Pandas DataFrame from the Z array, using alpha_values for the index (rows)
    # and s_values for the columns (headers).
    df_Z = pd.DataFrame(
        Z, 
        index=alpha_values, 
        columns=s_values
    )
    
    # 2. Assign meaningful names to the index and columns for the CSV file
    df_Z.index.name = r'alpha_gu' 
    df_Z.columns.name = r's'

    # 3. Use to_csv() to save the DataFrame, which automatically includes headers and index
    csv_filename = f'data/{dt_str}_believers_atequilibrium.csv'
    df_Z.to_csv(csv_filename, float_format='%.4f')
    
    print(f"Data matrix saved as {csv_filename} with row and column headers.")