from tqdm import tqdm
import os
import numpy as np
from functools import partial
import concurrent.futures
from simulation import Simulation
from hoax_config import HoaxConfig
from hoax_utils import create_graph, compute_statistics
from hoax_utils import plot_and_save_animated_sim, plot_and_save_sim_results, plot_and_save_statistics, plot_phase_diagram
from hoax_model_functions import hoax_initial_state, hoax_state_transition, stop_condition

def run_hoax_simulation(config: HoaxConfig, save=True, realization_number=None) -> tuple:
    '''
    Run one realization of the hoax model simulation.

    Args:
        config: hoax model's configuration object 
        save: if True, save and plot data and results of this single simulation
        realization_number: if the simulation is one of some realizations of the model, 
                            it receives the number identifying this single realization
    '''

    # 1. Generate the graph
    G = create_graph(config, save, realization_number)

    # 2. Create the simulator object
    sim = Simulation(
        G,
        partial(hoax_initial_state, config=config),
        partial(hoax_state_transition, config=config),
        stop_condition,
        name='hoax model',
        state_labels=['S', 'B', 'FC'],
        state_colors=config.state_colors
    )
    # 3. Run the simulator to the last step 
    sim.run(config.steps)

    # 4. Plotting and storing data
    if save:
        # saving configuration parameters  
        config.write_to_file()

        # Plot and save the the simulation results
        plot_and_save_sim_results(config, sim, realization_number)   

        # Plot and save the simulation as an animated GIF
        plot_and_save_animated_sim(config, sim, realization_number)

    # 5. Count believers, fact-checkers and susceptible agents at each step
    believers_counts = np.zeros(config.steps + 1)
    factcheckers_counts = np.zeros(config.steps + 1)
    susceptibles_counts = np.zeros(config.steps + 1)
    
    for i, state in enumerate(sim._states):
        counts = {'S': 0, 'B': 0, 'FC': 0}
        for v in state.values():
            if v in counts:
                counts[v] += 1
        believers_counts[i] = counts['B']
        factcheckers_counts[i] = counts['FC']
        susceptibles_counts[i] = counts['S']

    # 6. aggregate counts in a tuple
    counts_tuple = (believers_counts, factcheckers_counts, susceptibles_counts)  

    return sim, counts_tuple

def run_hoax_realizations(config: HoaxConfig, save=True) -> tuple:    
    # 1. initialize lists of simulators and counts
    sims = []
    counts_list = []
    for r in range(config.num_realizations): # realize the hoax model many times

        # 1.1 run single simulation, do not save intermediary files
        sim, counts_tuple = run_hoax_simulation(config, False, r)

        # 1.2 update lists of simulators and counts
        sims.append(sim)
        counts_list.append(counts_tuple)
    
    # 4. Compute statistics across realizations
    statistics = compute_statistics(counts_list)

    # 5. plot and save data and statistics across realizations
    if save:
        plot_and_save_statistics(statistics, counts_list, config)

    return statistics, counts_list, sims
   
# --- Helper Function for Parallel Execution ---

def worker_func(config: HoaxConfig, task):
    """
    A function to run a single simulation and return the result along with its indices.
    """
    # Unpack the task: alpha_index (i, row), s_index (j, column), alpha_val, s_val
    i, j, alpha_val, s_val = task
    config.alpha['gu'] = alpha_val
    config.p_seg = s_val

    # 1. Realize the model how many times as configured 
    _, counts_list, _ = run_hoax_realizations(config, save=False)
    
    # 2. Extract and calculate the mean z_value (i.e., number of believers at equilibrium)
    believers_arrays = [item[0] for item in counts_list] 
    z_value = np.array([item[-1] for item in believers_arrays]).mean()
    
    # 3. Return the indices and the calculated value
    return i, j, z_value

def full_experiment(config: HoaxConfig):
    """
    Run the full experiment varying s and alpha, and generate the phase diagram.
    """
    # 1. Define the range and step for s and alpha
    s_min, s_max, s_step = 0.5, 1.0, 0.02
    alpha_min, alpha_max, alpha_step = 0.7, 1.0, 0.01

    # 2. Generate the coordinate arrays
    s_values = np.arange(s_min, s_max, s_step)
    alpha_values = np.arange(alpha_min, alpha_max, alpha_step)

    # 3. Initialize the Z array to store the final number of believers len(s_values) x len(alpha_values)
    Z = np.zeros((len(alpha_values), len(s_values)))

    # 4. Prepare tasks for parallel execution
    tasks = []
    for i, alpha_val in enumerate(alpha_values):
        for j, s_val in enumerate(s_values):
            tasks.append((i, j, alpha_val, s_val))
    
    print(f"Starting parallel computation for {len(tasks)} points across {os.cpu_count()} cores...")
    N_tasks = len(tasks)

    # 5. Use ProcessPoolExecutor for parallel execution
    with concurrent.futures.ProcessPoolExecutor() as executor:
        futures = {executor.submit(worker_func, config, task): task for task in tasks}
        for future in tqdm(concurrent.futures.as_completed(futures), total=N_tasks, desc="Calculating Phase Diagram"):
            i, j, z_value = future.result()
            Z[i][j] = z_value

    return s_values, alpha_values, Z


if __name__ == "__main__":

    # 1. Configure model parameters
    config: HoaxConfig = HoaxConfig(
        num_nodes=1000,
        average_degree=6,
        alpha={'sk': 0.4, 'gu': 0.99},
        beta=0.5,
        p_v=0.02,
        p_f=0.8,
        p_seg=0.99,
        perc_believers=0.05,
        perc_factcheckers=0.0,
        steps=50,
        clustered=True,
        num_realizations=1,
        state_colors={'S': '#cccccc', 'B': '#377eb8', 'FC': '#e41a1c'},
        verbose=True,
        type="single"
    )

    if config.verbose:
        # Print parameters
        print(config)
    
    # 2. Run the full experiment
    # s_values, alpha_values, Z = full_experiment(config)

    # 3. Plot the phase diagram
    # plot_phase_diagram(s_values, alpha_values, Z, config)
    
    
    # Run a single simulation for testing
    run_hoax_simulation(config, save = True)

    # Run many simulations for testing
    # sim = run_hoax_realizations(config, save=True)

    # worker_func(config, (0, 0, config.alpha['gu'], config.p_seg ))
    