import matplotlib.pyplot as plt


def plot_loss(losses):
    plt.plot(losses)
    plt.title("Training Loss")
    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.savefig("results/loss.png")
    plt.show()